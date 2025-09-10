import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import * as MUI from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ErrorIcon from '@mui/icons-material/Error';
import { invokeAction } from 'actions/invoke';
import { copilotStorage } from 'helpers/localStorage/actions';
import { Manager, TaskHelper } from '@twilio/flex-ui';
import { copilotService } from '../../services/copilotService';
import { validQueuesDocument } from '../../services/sync/validQueuesDocument';
import { backgroundMessageHandler } from '../../helpers/backgroundMessageHandler';

interface CopilotIAProps {
    copilotIA?: {
        message?: string;
        author?: string;
        conversation?: {
            sid?: string;
            taskId?: string;
            [key: string]: any;
        };
        task?: any;
        agentName?: string;
        sid?: string;
    }
}

interface Message {
    message: string;
    author: string;
    isAI?: boolean;
    liked?: boolean;
    isClient?: boolean;
    isProcessing?: boolean;
    isEdited?: boolean;
    processed?: boolean;
    agentName?: string;
    sid?: string;
    groupId?: string;
    isError?: boolean;
}

interface TaskConversation {
    messages: Message[];
    isProcessing: boolean;
    conversationSid?: string;
    lastUpdated?: number;
    groupingTimer?: NodeJS.Timeout;
    processingStartTime?: number;
    currentGrouping?: NodeJS.Timeout;
}

// Mapeamento entre conversation.sid e taskId
interface ConversationTaskMapping {
    [conversationSid: string]: string; // conversationSid -> taskId
}

// Interface para controlar timers de processamento em background
interface BackgroundProcessingTimers {
    [taskId: string]: NodeJS.Timeout;
}


// Add this function to check if worker has required skills and task is in valid queue
const hasRequiredSkills = async (): Promise<boolean> => {
    try {
        const manager = Manager.getInstance();
        const currentWorker = manager.workerClient;
        if (!currentWorker) return false;
        
        // Get worker skills from attributes
        const workerAttributes = currentWorker.attributes;
        const workerSkills = workerAttributes.routing?.skills || [];
        const requiredSkills = ['copilot_enabled'];
        const hasSkill = requiredSkills.some(skill => workerSkills.includes(skill));
        
        // Get current task from URL
        const taskSid = window.location.href.split('/').pop();
        //console.log('taskSid', taskSid);
        if (!taskSid || taskSid === 'agent-desktop') return false;

        // Get task details
        const task = TaskHelper.getTaskByTaskSid(taskSid);
        //console.log('task', task);
        if (!task) return false;

        // Get task queue
        const taskQueue = task.queueName;
        //console.log('taskQueue', taskQueue);
        if (!taskQueue) return false;
        
        // Get valid queues from Sync Document
        const validQueuesConfig = await validQueuesDocument.get();
        //const validQueues = ['[WhatsApp] Seguros Novos'];
        const validQueues = validQueuesConfig?.queues || ''; // Fallback to default if not configured
        
        // Check if task's queue is in the valid queues list
        const hasValidQueue = validQueues.includes(taskQueue);

        if (manager.serviceConfiguration.account_sid === process.env.REACT_APP_TWILIO_ACCOUNT_SID) {
            return true;
        }
        
        return hasSkill && hasValidQueue;
    } catch (e) {
        console.error('Error checking worker skills and task queue:', e);
        return false;
    }
};

// Wrapper component that handles authorization
const withAuthorization = (WrappedComponent: React.ComponentType<any>) => {
    return (props: any) => {
        const [isAuthorized, setIsAuthorized] = useState(false);
        const lastUrlRef = useRef<string>(window.location.href);

        useEffect(() => {
            const manager = Manager.getInstance();
            const worker = manager.workerClient;

            const checkAuthorization = async () => {
                const hasSkills = await hasRequiredSkills();
                setIsAuthorized(hasSkills);
            };

            // Initial check
            checkAuthorization();

            // Listen for worker updates
            if (worker) {
                worker.on('attributesUpdated', checkAuthorization);
            }

            // Add URL change listener
            const handleUrlChange = () => {
                checkAuthorization();
            };
            window.addEventListener('popstate', handleUrlChange);
            window.addEventListener('pushstate', handleUrlChange);

            // Add polling for URL changes
            const urlCheckInterval = setInterval(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== lastUrlRef.current) {
                    lastUrlRef.current = currentUrl;
                    checkAuthorization();
                }
            }, 1000); // Check every second

            return () => {
                if (worker) {
                    worker.off('attributesUpdated', checkAuthorization);
                }
                window.removeEventListener('popstate', handleUrlChange);
                window.removeEventListener('pushstate', handleUrlChange);
                clearInterval(urlCheckInterval);
            };
        }, []);

        if (!isAuthorized) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

// Update the type definitions to be more explicit
type TextPart = {
    type: 'bold' | 'text';
    content: string;
};

type LinkPart = {
    type: 'url' | 'text';
    content: string | TextPart[];
};

type BulletLine = {
    type: 'bullet';
    content: TextPart[];
};

type TextLine = {
    type: 'text';
    content: TextPart[];
};

type LinkLine = {
    type: 'link';
    content: LinkPart[];
};

type LineContent = BulletLine | TextLine | LinkLine;

// Update the formatAIMessage function to fix variable redeclaration and type issues
const formatAIMessage = (message: string): LineContent[] => {
    // Split message into lines to handle bullet points and other formatting
    const lines = message.split('\n');
    const formattedLines: LineContent[] = lines.map(line => {
        // Handle bullet points with asterisk
        if (line.trim().startsWith('* ')) {
            const bulletContent = line.trim().substring(2);
            // Process bold text within bullet points
            const bulletParts = processBoldText(bulletContent);
            return { type: 'bullet' as const, content: bulletParts };
        }
        // Handle regular bullet points
        if (line.trim().startsWith('- ')) {
            const bulletContent = line.trim().substring(2);
            // Process bold text within bullet points
            const bulletParts = processBoldText(bulletContent);
            return { type: 'bullet' as const, content: bulletParts };
        }
        // Handle links (basic URL detection)
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urlParts = line.split(urlRegex);
        if (urlParts.length > 1) {
            return {
                type: 'link' as const,
                content: urlParts.map((part, index) => {
                    if (part.match(urlRegex)) {
                        return { type: 'url' as const, content: part };
                    }
                    // Process bold text within links
                    return { type: 'text' as const, content: processBoldText(part) };
                })
            };
        }
        // Regular text with bold formatting
        const textParts = processBoldText(line);
        return { type: 'text' as const, content: textParts };
    });
    return formattedLines;
};

// Update the processBoldText function to ensure proper typing
const processBoldText = (text: string): TextPart[] => {
    const parts: TextPart[] = [];
    let currentIndex = 0;
    let boldStart = text.indexOf('**');

    while (boldStart !== -1) {
        // Add text before bold
        if (boldStart > currentIndex) {
            parts.push({
                type: 'text' as const,
                content: text.slice(currentIndex, boldStart)
            });
        }

        // Find end of bold
        const boldEnd = text.indexOf('**', boldStart + 2);
        if (boldEnd === -1) break;

        // Add bold text
        parts.push({
            type: 'bold' as const,
            content: text.slice(boldStart + 2, boldEnd)
        });

        currentIndex = boldEnd + 2;
        boldStart = text.indexOf('**', currentIndex);
    }

    // Add remaining text
    if (currentIndex < text.length) {
        parts.push({
            type: 'text' as const,
            content: text.slice(currentIndex)
        });
    }

    return parts.length > 0 ? parts : [{ type: 'text' as const, content: text }];
};

interface FormattedMessageProps {
    message: string;
    isAI: boolean;
}

// Update the FormattedMessage component to handle the types more explicitly
const FormattedMessage: React.FC<FormattedMessageProps> = ({ message, isAI }) => {
    if (!isAI) {
        return <MUI.Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{message}</MUI.Typography>;
    }

    const formattedLines = formatAIMessage(message);

    return (
        <MUI.Box>
            {formattedLines.map((line, lineIndex) => {
                switch (line.type) {
                    case 'bullet':
                        return (
                            <MUI.Box key={lineIndex} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                <MUI.Box component="span" sx={{ mr: 1, mt: 0.5 }}>•</MUI.Box>
                                <MUI.Box>
                                    {line.content.map((part: TextPart, partIndex: number) => (
                                        part.type === 'bold' ? (
                                            <MUI.Typography
                                                key={partIndex}
                                                variant="body2"
                                                component="span"
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                                {part.content}
                                            </MUI.Typography>
                                        ) : (
                                            <MUI.Typography
                                                key={partIndex}
                                                variant="body2"
                                                component="span"
                                            >
                                                {part.content}
                                            </MUI.Typography>
                                        )
                                    ))}
                                </MUI.Box>
                            </MUI.Box>
                        );
                    case 'link':
                        return (
                            <MUI.Box key={lineIndex} sx={{ mb: 1 }}>
                                {line.content.map((part: LinkPart, partIndex: number) => {
                                    if (part.type === 'url' && typeof part.content === 'string') {
                                        return (
                                            <MUI.Button
                                                key={partIndex}
                                                size="small"
                                                variant="outlined"
                                                href={part.content}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<LinkIcon />}
                                                endIcon={<OpenInNewIcon />}
                                                sx={{
                                                    color: '#fff',
                                                    borderColor: '#fff',
                                                    '&:hover': {
                                                        borderColor: '#fff',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                                    },
                                                    textTransform: 'none',
                                                    py: 0.5,
                                                    px: 1,
                                                    minWidth: 'auto',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {part.content}
                                            </MUI.Button>
                                        );
                                    }
                                    const textContent = part.content as TextPart[];
                                    return (
                                        <MUI.Typography key={partIndex} variant="body2" component="span">
                                            {textContent.map((textPart: TextPart, textIndex: number) => (
                                                textPart.type === 'bold' ? (
                                                    <MUI.Typography
                                                        key={textIndex}
                                                        variant="body2"
                                                        component="span"
                                                        sx={{ fontWeight: 'bold' }}
                                                    >
                                                        {textPart.content}
                                                    </MUI.Typography>
                                                ) : (
                                                    <MUI.Typography
                                                        key={textIndex}
                                                        variant="body2"
                                                        component="span"
                                                    >
                                                        {textPart.content}
                                                    </MUI.Typography>
                                                )
                                            ))}
                                        </MUI.Typography>
                                    );
                                })}
                            </MUI.Box>
                        );
                    case 'text':
                        return (
                            <MUI.Box key={lineIndex} sx={{ mb: 1 }}>
                                {line.content.map((part: TextPart, partIndex: number) => (
                                    part.type === 'bold' ? (
                                        <MUI.Typography
                                            key={partIndex}
                                            variant="body2"
                                            component="span"
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            {part.content}
                                        </MUI.Typography>
                                    ) : (
                                        <MUI.Typography
                                            key={partIndex}
                                            variant="body2"
                                            component="span"
                                        >
                                            {part.content}
                                        </MUI.Typography>
                                    )
                                ))}
                            </MUI.Box>
                        );
                }
            })}
        </MUI.Box>
    );
};

// Helper function to convert double asterisks to single asterisks for editing
const convertBoldFormattingForEdit = (message: string): string => {
    return message.replace(/\*\*(.*?)\*\*/g, '*$1*');
};

const CopilotIAComponent: React.FC<CopilotIAProps> = ({
    copilotIA
}) => {
    // All hooks at the top
    const [messages, setMessages] = useState<Message[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
    const [reservationSid, setReservationSid] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const previousReservationSidRef = useRef<string | null>(null);
    const [sidToTaskIdMapping, setSidToTaskIdMapping] = useState<ConversationTaskMapping>({});
    const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
    const [editedMessage, setEditedMessage] = useState<string>('');
    const [isGrouping, setIsGrouping] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const groupingTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Helper function to get concatenated customer messages for a given AI message
    const getCustomerMessagesByGroupId = (aiMessageGroupId: string, aiMessageIndex?: number): string => {
        // Use current state messages instead of localStorage to ensure we have the latest data
        const currentMessages = messages;
        
        if (!currentMessages || currentMessages.length === 0) {
            console.log('[CopilotIA] getCustomerMessagesByGroupId: No messages in current state');
            return '';
        }
        
        console.log('[CopilotIA] getCustomerMessagesByGroupId: Looking for groupId:', aiMessageGroupId, 'at index:', aiMessageIndex);
        console.log('[CopilotIA] getCustomerMessagesByGroupId: All messages in current state:', currentMessages);
        
        let customerMessages: string[] = [];
        
        // First try to find messages by groupId
        if (aiMessageGroupId) {
            customerMessages = currentMessages
                .filter((msg: Message) => {
                    const isCustomerMessage = !msg.isAI;
                    const hasMatchingGroupId = msg.groupId === aiMessageGroupId;
                    console.log(`[CopilotIA] Message: "${msg.message.substring(0, 50)}...", isAI: ${msg.isAI}, groupId: ${msg.groupId}, matches: ${hasMatchingGroupId}`);
                    return isCustomerMessage && hasMatchingGroupId;
                })
                .map((msg: Message) => msg.message);
        }
        
        // If no messages found by groupId and we have an index, try to find messages before this AI message
        if (customerMessages.length === 0 && aiMessageIndex !== undefined) {
            console.log('[CopilotIA] getCustomerMessagesByGroupId: No messages found by groupId, trying to find messages before AI message at index:', aiMessageIndex);
            
            // Find all customer messages that come before this AI message and after the previous AI message
            let previousAIIndex = -1;
            for (let i = aiMessageIndex - 1; i >= 0; i--) {
                if (currentMessages[i].isAI) {
                    previousAIIndex = i;
                    break;
                }
            }
            
            customerMessages = currentMessages
                .slice(previousAIIndex + 1, aiMessageIndex)
                .filter((msg: Message) => !msg.isAI)
                .map((msg: Message) => msg.message);
                
            console.log('[CopilotIA] getCustomerMessagesByGroupId: Found customer messages by index range:', customerMessages);
        }
        
        console.log('[CopilotIA] getCustomerMessagesByGroupId: Final customer messages:', customerMessages);
        
        // Concatenate with comma separator
        const result = customerMessages.join(' , ');
        console.log('[CopilotIA] getCustomerMessagesByGroupId: Final result:', result);
        return result;
    };

    // Add effect to check for conversation updates
    useEffect(() => {
        if (!reservationSid) return;

        const checkConversationUpdates = () => {
            try {
                const conversations = copilotStorage.getConversations();
                const currentConversation = conversations[reservationSid];
                console.log(`[CopilotIA] Checking updates for ${reservationSid}, found: ${!!currentConversation}`);
            
                if (currentConversation) {
                    setMessages(currentConversation.messages);
                    setIsProcessing(currentConversation.isProcessing);

                    // Check for unprocessed messages
                    const hasUnprocessedMessages = currentConversation.messages.some(
                        (msg: Message) => !msg.processed && !msg.isAI
                    );
                    
                    // Update grouping state based on conversation state
                    setIsGrouping(hasUnprocessedMessages && !currentConversation.isProcessing);
                    
                    // Update pending messages if there are unprocessed ones
                    if (hasUnprocessedMessages) {
                        const unprocessedMessages = currentConversation.messages.filter(
                            (msg: Message) => !msg.processed && !msg.isAI
                        );
                        setPendingMessages(unprocessedMessages);
                    } else {
                        setPendingMessages([]);
                    }
                }
            } catch (error) {
                console.error(`[CopilotIA] Error checking conversation updates for ${reservationSid}:`, error);
            }
        };

        // Check immediately
        checkConversationUpdates();

        // Set up interval to check for updates
        const intervalId = setInterval(checkConversationUpdates, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [reservationSid]);

    // Função para inserir texto no textarea de input da mensagem
    const insertTextIntoMessageInput = (text: string) => {
        if (!reservationSid) return;
        const conversationSid = getConversationSidFromReservationSid(reservationSid);
        if (!conversationSid) return;
        invokeAction.setInputText(text, conversationSid);
    };

    // Função para salvar o mapeamento no localStorage
    const saveMapping = (mapping: ConversationTaskMapping) => {
        copilotStorage.setMapping(mapping);
    };

    // Função para carregar o mapeamento do localStorage
    const loadMapping = (): ConversationTaskMapping => {
        return copilotStorage.getMapping();
    };

    // Função para atualizar o mapeamento
    const updateMapping = (reservationSid: string, conversationSid: string) => {
        setSidToTaskIdMapping(prev => {
            // Only update if there's no existing mapping for this reservation
            if (!prev[reservationSid]) {
                const updated = { ...prev, [reservationSid]: conversationSid };
                saveMapping(updated);
                return updated;
            }
            return prev;
        });
    };

    // Função para obter o reservationSid a partir do conversationSid
    const getReservationSidFromSid = (conversationSid: string): string | null => {
        const mapping = copilotStorage.getMapping();
        // Find the reservationSid that maps to this conversationSid
        const reservationSid = Object.keys(mapping).find(key => mapping[key] === conversationSid);
        return reservationSid || null;
    };

    const getConversationSidFromReservationSid = (reservationSid: string): string | null => {
        const mapping = copilotStorage.getMapping();
        return mapping[reservationSid] || null;
    };

    // Função para salvar o estado da conversa atual no localStorage
    const saveConversationState = (currentReservationSid: string | null, currentConversationSid?: string) => {
        if (!currentReservationSid || currentReservationSid === 'agent-desktop') return;


        // Preserve groupingTimer and processingStartTime from previous state
        const conversations = copilotStorage.getConversations();
        const previous = conversations[currentReservationSid] || {};

        const conversationState: TaskConversation = {
            messages,
            isProcessing,
            conversationSid: currentConversationSid,
            lastUpdated: Date.now(),
            currentGrouping: previous.currentGrouping, // preserve per-group timer!
            processingStartTime: previous.processingStartTime // preserve processing time!
        };

        // Obter todas as conversas existentes
        conversations[currentReservationSid] = conversationState;

        // Salvar no localStorage
        try {
            copilotStorage.setConversations(conversations);
            console.log(`[CopilotIA] Saved conversation state for ${currentReservationSid}`);
        } catch (error) {
            console.error(`[CopilotIA] Error saving conversation for ${currentReservationSid}:`, error);
        }
    };

    // Função para carregar a conversa de um reservationSid específico
    const loadConversationState = (newReservationSid: string | null) => {
        if (!newReservationSid || newReservationSid === 'agent-desktop') return;


        const conversations = copilotStorage.getConversations();
        const conversationState = conversations[newReservationSid];

        if (conversationState) {
            
            // Filter out any duplicate unprocessed messages
            const uniqueMessages = conversationState.messages.reduce((acc: Message[], current: Message) => {
                const isDuplicate = acc.some((msg: Message) => 
                    !msg.processed && 
                    !msg.isAI && 
                    msg.message === current.message && 
                    msg.author === current.author
                );
                
                if (!isDuplicate) {
                    acc.push(current);
                }
                return acc;
            }, []);

            // Always set messages directly from localStorage, don't merge with existing state
            setMessages(uniqueMessages);
            setIsProcessing(conversationState.isProcessing);

            // Se houver um conversationSid associado a este reservationSid, atualizar o mapeamento
            if (conversationState.conversationSid) {
                updateMapping(newReservationSid, conversationState.conversationSid);
            }

            // Verificar se há mensagens não processadas
            const unprocessedMessages = uniqueMessages.filter((msg: Message) => !msg.processed && !msg.isAI);
            
            if (unprocessedMessages.length > 0) {
                setPendingMessages(unprocessedMessages);
                setIsGrouping(true);
            }
        } else {
            // Inicializar uma nova conversa
            setMessages([]);
            setPendingMessages([]);
            setIsProcessing(false);
        }
    };

    const processPendingMessages = (newMessage?: Message, targetReservationSid: string | null = reservationSid, conversationSid?: string) => {
        if (!targetReservationSid) return;


        if (pendingMessages.length === 0 && !newMessage) return;

        // Get the latest state from localStorage
        const conversations = copilotStorage.getConversations();
        const currentConversation = conversations[targetReservationSid] || { messages: [] };

        // Exibir todas as mensagens individuais do cliente
        const updatedMessages = [...currentConversation.messages];

        // Adicionar newMessage se existir
        const messagesToProcess = newMessage
            ? [...pendingMessages, newMessage]
            : pendingMessages;

        for (const pendingMsg of messagesToProcess) {
            updatedMessages.push({
                ...pendingMsg,
                isClient: true
            });
        }

        // Update both state and localStorage with the latest messages
        setMessages(updatedMessages);
        
        // Update localStorage with the latest state
        conversations[targetReservationSid] = {
            ...currentConversation,
            messages: updatedMessages,
            isProcessing: true,
            lastUpdated: Date.now()
        };
        try {
            try {
                copilotStorage.setConversations(conversations);
                console.log(`[CopilotIA] Saved message to localStorage for ${targetReservationSid}`);
            } catch (error) {
                console.error(`[CopilotIA] Error saving message for ${targetReservationSid}:`, error);
            }
            console.log(`[CopilotIA] Saved pending message for ${targetReservationSid}`);
        } catch (error) {
            console.error(`[CopilotIA] Error saving pending message for ${targetReservationSid}:`, error);
        }

        setPendingMessages([]);
    };

    // Carregar o mapeamento ao inicializar
    useEffect(() => {
        const mapping = loadMapping();
        setSidToTaskIdMapping(mapping);

        // Load initial conversation if we have a reservationSid
        const initialReservationSid = window.location.href.split('/').pop() || null;
        if (initialReservationSid && initialReservationSid !== 'agent-desktop') {
            setReservationSid(initialReservationSid);
            loadConversationState(initialReservationSid);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            if (reservationSid) {
                saveConversationState(reservationSid);
            }
        };
    }, []);

    useEffect(() => {
        const path = window.location.href.split('/').pop() || null;
        // Only set reservationSid if it's not agent-desktop and is a valid format
        const newReservationSid = path && path !== 'agent-desktop' ? path : null;

        // Se o reservationSid mudou ou é a primeira vez que estamos carregando
        if (newReservationSid !== reservationSid || !reservationSid) {
            // Salvar o estado da conversa anterior apenas se for diferente
            if (reservationSid && reservationSid !== newReservationSid) {
                saveConversationState(reservationSid);
                previousReservationSidRef.current = reservationSid;
            }

            // Atualizar reservationSid atual
            setReservationSid(newReservationSid);

            // Carregar conversa para o novo reservationSid
            if (newReservationSid) {
                // Reset states before loading new conversation
                setMessages([]);
                setPendingMessages([]);
                setIsProcessing(false);
                loadConversationState(newReservationSid);
            } else {
                // Reset state if no reservationSid
                setMessages([]);
                setPendingMessages([]);
                setIsProcessing(false);
                loadConversationState(newReservationSid);
            }
        }
    }, [window.location.href]);

    // Update the message handling effect to use the background handler
    useEffect(() => {
        if (copilotIA?.message && copilotIA?.author?.startsWith('whatsapp') && copilotIA?.conversation?.sid) {
            const conversationSid = copilotIA.conversation.sid;

            // Nova mensagem com o conversationSid
            const newMessage = {
                message: copilotIA.message,
                author: copilotIA.author,
                liked: false,
                processed: false,
                agentName: copilotIA.agentName,
                sid: copilotIA.sid
            };

            // Verificar se já temos um reservationSid associado a este conversationSid
            const messageReservationSid = getReservationSidFromSid(conversationSid);

            const targetReservationSid = messageReservationSid && messageReservationSid !== 'agent-desktop'
                ? messageReservationSid
                : (copilotIA.task?.taskSid && copilotIA.task?.taskSid !== 'agent-desktop' ? copilotIA.task.taskSid : null);

            if (!targetReservationSid) {
                return;
            }

            // Get the current conversation state from localStorage
            const conversations = copilotStorage.getConversations();
            const existingConversation = conversations[targetReservationSid] || {
                messages: [],
                isProcessing: false,
                conversationSid,
                lastUpdated: Date.now()
            };

            // Check for duplicate messages using the message SID
            const hasDuplicate = existingConversation.messages.some((msg: Message) => 
                !msg.isAI && 
                msg.sid === newMessage.sid
            );

            if (hasDuplicate) {
                return;
            }

            // Add the new message to the list of unprocessed messages
            const updatedMessages = [
                ...existingConversation.messages,
                newMessage
            ];

            // Atualizar o estado da conversa no localStorage
            conversations[targetReservationSid] = {
                ...existingConversation,
                messages: updatedMessages,
                isProcessing: true,
                lastUpdated: Date.now()
            };

            try {
                copilotStorage.setConversations(conversations);
                console.log(`[CopilotIA] Saved message to localStorage for ${targetReservationSid}`);
            } catch (error) {
                console.error(`[CopilotIA] Error saving message for ${targetReservationSid}:`, error);
            }

            // Notify the background handler about the new message
            backgroundMessageHandler.handleNewMessage(targetReservationSid);

            // Se estamos na task atual, atualizar o estado também
            if (targetReservationSid === reservationSid) {
                setMessages(updatedMessages);
                // Re-filter pending messages from the updated list to ensure correctness
                const currentPending = updatedMessages.filter(msg => !msg.processed && !msg.isAI);
                setPendingMessages(currentPending);
            }
        }
    }, [copilotIA]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            if (reservationSid) {
                saveConversationState(reservationSid);
            }

            // Cleanup background handler when component unmounts
            backgroundMessageHandler.cleanup();
        };
    }, []);

    useEffect(() => {
        if (reservationSid) {
            saveConversationState(reservationSid);
        }
    }, [messages, isProcessing, isGrouping]);

    useEffect(() => {
        const checkSkills = async () => {
            const hasSkills = await hasRequiredSkills();
            setIsVisible(hasSkills);
        };
        checkSkills();
    }, []);



    const handleLike = async (index: number) => {
        if (!reservationSid) return;


        // Capture all AI messages that will be deleted (including the liked one)
        const messagesToDelete: Message[] = [];
        for (let i = 0; i <= index; i++) {
            if (messages[i].isAI) {
                messagesToDelete.push(messages[i]);
            }
        }

        // Capture customer messages for the liked message BEFORE updating the UI
        const likedMessage = messages[index];
        const customerMessages = getCustomerMessagesByGroupId(likedMessage.groupId || '');

        // First update the UI and input
        setMessages(prev => {
            // Keep only messages after the liked one
            const updated = prev.slice(index + 1);
            
            // Update localStorage
            if (reservationSid) {
                const conversations = copilotStorage.getConversations();
                if (conversations[reservationSid]) {
                    conversations[reservationSid] = {
                        ...conversations[reservationSid],
                        messages: updated,
                        lastUpdated: Date.now()
                    };
                    try {
                        copilotStorage.setConversations(conversations);
                        console.log(`[CopilotIA] Saved message to localStorage for ${reservationSid}`);
                    } catch (error) {
                        console.error(`[CopilotIA] Error saving message for ${reservationSid}:`, error);
                    }
                }
            }

            // Insert the liked message text into the input (convert double asterisks to single)
            const convertedMessage = convertBoldFormattingForEdit(prev[index].message);
            insertTextIntoMessageInput(convertedMessage);
            return updated;
        });

        // Then try to send feedback for all deleted messages in the background
        const conversationSid = getConversationSidFromReservationSid(reservationSid);
        const manager = Manager.getInstance();
        const currentUser = manager.workerClient?.friendlyName || manager.user.identity;
        const currentUserEmail = manager.workerClient?.attributes?.email;
        
        // Get task from Twilio
        const task = TaskHelper.getTaskByTaskSid(reservationSid);
        const customerNumber = task?.attributes?.customerAddress;
        
        if (conversationSid && customerNumber) {
            // Send feedback for each deleted message independently
            for (const deletedMessage of messagesToDelete) {
                const isLikedMessage = deletedMessage === likedMessage;
                const feedbackType = isLikedMessage ? 0 : 2; // 0 for liked, 2 for deleted
                
                console.log(`[CopilotIA] handleLike: Processing ${isLikedMessage ? 'liked' : 'deleted'} message:`, {
                    message: deletedMessage.message.substring(0, 100) + '...',
                    groupId: deletedMessage.groupId,
                    isAI: deletedMessage.isAI
                });
                
                // Get customer messages for this specific message
                // Find the index of this message in the current messages array
                const messageIndex = messages.findIndex(msg => 
                    msg.isAI && 
                    msg.message === deletedMessage.message && 
                    msg.groupId === deletedMessage.groupId
                );
                const messageCustomerMessages = getCustomerMessagesByGroupId(deletedMessage.groupId || '', messageIndex);
                
                console.log(`[CopilotIA] handleLike: Customer messages for feedback: "${messageCustomerMessages}"`);
                
                // Send each feedback request independently - don't await to prevent blocking
                copilotService.sendFeedback({
                    Guid: conversationSid,
                    AgentName: deletedMessage.agentName || '',
                    InputMessage: deletedMessage.message,
                    UserMessage: messageCustomerMessages,
                    EditedInputMessage: '', // Empty string instead of null
                    FeedbackMessageType: feedbackType,
                    Telephone: customerNumber,
                    UserId: currentUser,
                    Email: currentUserEmail
                }, task).catch(error => {
                    console.error(`Error sending feedback for ${isLikedMessage ? 'liked' : 'deleted'} message:`, error);
                    // Don't throw - just log the error for this specific message
                });
            }
        }
    };

    const handleEdit = (index: number) => {
        setEditingMessageIndex(index);
        // Convert double asterisks to single asterisks for editing
        const convertedMessage = convertBoldFormattingForEdit(messages[index].message);
        setEditedMessage(convertedMessage);
    };

    const handleSaveEdit = async (index: number) => {
        if (!reservationSid || !editedMessage.trim()) {
            return;
        }

        setIsSavingEdit(true);

        const originalMessage = messages[index].message;
        // Keep the edited message as-is (with single asterisks) for the input
        const finalEditedMessage = editedMessage.trim();
        const conversationSid = getConversationSidFromReservationSid(reservationSid);

        if (!conversationSid) {
            setIsSavingEdit(false);
            return;
        }

        // Capture customer messages BEFORE updating the UI
        console.log(`[CopilotIA] handleSaveEdit: Editing message at index ${index}:`, {
            message: messages[index].message.substring(0, 100) + '...',
            groupId: messages[index].groupId,
            isAI: messages[index].isAI
        });
        
        const customerMessages = getCustomerMessagesByGroupId(messages[index].groupId || '', index);
        
        console.log(`[CopilotIA] handleSaveEdit: Customer messages for feedback: "${customerMessages}"`);

        try {
            const manager = Manager.getInstance();
            const currentUser = manager.workerClient?.friendlyName || manager.user.identity;
            const currentUserEmail = manager.workerClient?.attributes?.email;

            // Get task from Twilio
            const task = TaskHelper.getTaskByTaskSid(reservationSid);
            //console.log('Task for edit:'    , task?.attributes);
            
            // Fix: Use the correct path for customer number
            const customerNumber = task?.attributes?.customerAddress;

            if (!customerNumber) {
                setIsSavingEdit(false);
                return;
            }

            await copilotService.sendFeedback({
                Guid: conversationSid,
                AgentName: messages[index].agentName || '',
                InputMessage: originalMessage,
                EditedInputMessage: finalEditedMessage,
                UserMessage: customerMessages, // Use captured customer messages
                FeedbackMessageType: 1, // 1 for edits
                Telephone: customerNumber,
                UserId: currentUser,
                Email: currentUserEmail
            }, task);

            // Update the message in the UI and handle conversation reset
            setMessages(prev => {
                // Keep only messages after the edited one
                const updated = prev.slice(index + 1);
                
                // Update localStorage
                if (reservationSid) {
                    const conversations = copilotStorage.getConversations();
                    if (conversations[reservationSid]) {
                        conversations[reservationSid] = {
                            ...conversations[reservationSid],
                            messages: updated,
                            lastUpdated: Date.now()
                        };
                        try {
                        copilotStorage.setConversations(conversations);
                        console.log(`[CopilotIA] Saved message to localStorage for ${reservationSid}`);
                    } catch (error) {
                        console.error(`[CopilotIA] Error saving message for ${reservationSid}:`, error);
                    }
                    }
                }

                // Insert the edited message text into the input (keep single asterisks)
                insertTextIntoMessageInput(finalEditedMessage);
                return updated;
            });

        } catch (error) {
            console.error('Error saving edited message:', error);
            // Show error to user
            alert('Erro ao salvar a edição. Por favor, tente novamente.');
        } finally {
            setIsSavingEdit(false);
            setEditingMessageIndex(null);
            setEditedMessage('');
        }
    };

    if (!isVisible) return null;

    if (!reservationSid) {
        return (
            <MUI.Box sx={{
                position: 'sticky',
                top: 0,
                borderBottom: '1px solid',
                borderColor: 'divider',
                zIndex: 1,
                p: 2,
                height: '5.55rem'
            }}>
                <MUI.Box display="flex" alignItems="center">
                    <SmartToyIcon sx={{ mr: 1, color: '#2196f3' }} />
                    <MUI.Typography variant="h6" component="h2" color="primary">
                        Copilot IA
                    </MUI.Typography>
                </MUI.Box>
                <MUI.Typography variant="body1" textAlign="center" color="text.secondary">
                    Nenhuma task selecionada.
                </MUI.Typography>
            </MUI.Box>
        );
    }

    return (
        <MUI.Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%'
        }}>
            {/* Header Fixo */}
            <MUI.Box sx={{
                position: 'sticky',
                top: 0,
                borderBottom: '1px solid',
                borderColor: 'divider',
                zIndex: 1,
                p: 2,
                height: '5.55rem'
            }}>
                <MUI.Box sx={{ mb: 2 }}>
                    <MUI.Box display="flex" alignItems="center">
                        <SmartToyIcon sx={{ mr: 1, color: '#2196f3' }} />
                        <MUI.Typography variant="h6" component="h2" color="primary">
                            Copilot IA
                        </MUI.Typography>
                    </MUI.Box>
                    <MUI.Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Task - {reservationSid}
                    </MUI.Typography>
                </MUI.Box>
            </MUI.Box>

            {/* Área de Mensagens com Scroll */}
            <MUI.Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                p: 2
            }}>
                {messages.length > 0 || pendingMessages.length > 0 ? (
                    <MUI.Box>
                        {messages.map((msg, index) => (
                            <MUI.Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.isAI ? 'flex-end' : 'flex-start',
                                    mb: 1.5
                                }}
                            >
                                <MUI.Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '70%',
                                        backgroundColor: msg.isAI ? 
                                            (msg.isError ? '#d32f2f' : // Red for error messages
                                             msg.liked ? '#1565c0' : '#1976d2') : 
                                            '#424242',
                                        color: '#fff',
                                        borderRadius: 2,
                                        position: 'relative',
                                        opacity: msg.isProcessing ? 0.7 : 1,
                                        borderBottom: msg.liked ? '1px solid #64f6a3' : 'none',
                                        borderLeft: msg.isEdited ? '3px solid #ffd700' : 'none',
                                        borderTop: msg.isError ? '3px solid #ff6b6b' : 'none' // Red border for error messages
                                    }}
                                >
                                    {msg.isError && (
                                        <MUI.Box display="flex" alignItems="center" mb={1}>
                                            <ErrorIcon sx={{ fontSize: 16, color: '#ff6b6b', mr: 0.5 }} />
                                            <MUI.Typography variant="caption" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                                Erro na API
                                            </MUI.Typography>
                                        </MUI.Box>
                                    )}
                                    <FormattedMessage message={msg.message} isAI={msg.isAI || false} />
                                    {msg.isEdited && (
                                        <MUI.Typography 
                                            variant="caption" 
                                            sx={{ 
                                                display: 'block', 
                                                mt: 0.5, 
                                                color: '#ffd700',
                                                fontStyle: 'italic'
                                            }}
                                        >
                                            (editado)
                                        </MUI.Typography>
                                    )}
                                    {msg.isProcessing && (
                                        <MUI.Box display="flex" alignItems="center" mt={1}>
                                            <MUI.CircularProgress size={14} />
                                            <MUI.Typography variant="caption" ml={1}>
                                                Processando...
                                            </MUI.Typography>
                                        </MUI.Box>
                                    )}
                                </MUI.Paper>

                                {msg.isAI && !msg.liked && !msg.isProcessing && !msg.isError && (
                                    <MUI.Box mt={0.5}>
                                        <MUI.IconButton
                                            size="small"
                                            color="primary"
                                            sx={{ mr: 0.5, padding: '2px' }}
                                            onClick={() => handleLike(index)}
                                        >
                                            <ThumbUpIcon sx={{ fontSize: 16 }} />
                                        </MUI.IconButton>
                                        <MUI.IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEdit(index)}
                                            disabled={isProcessing}
                                            sx={{ padding: '2px' }}
                                        >
                                            <EditIcon sx={{ fontSize: 16 }} />
                                        </MUI.IconButton>
                                    </MUI.Box>
                                )}

                                {editingMessageIndex === index && (
                                    <MUI.Box 
                                        mt={1} 
                                        sx={{ 
                                            width: '90%', 
                                            ml: 'auto',
                                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                            p: 2,
                                            borderRadius: 2,
                                            border: '1px solid #1976d2'
                                        }}
                                    >
                                        <MUI.TextField
                                            fullWidth
                                            multiline
                                            value={editedMessage}
                                            onChange={(e) => setEditedMessage(e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                backgroundColor: '#fff',
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#1976d2',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#1565c0',
                                                    },
                                                    '& input': {
                                                        color: '#000',
                                                    },
                                                    '& textarea': {
                                                        color: '#000',
                                                    }
                                                },
                                            }}
                                        />
                                        <MUI.Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                                            <MUI.Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    setEditingMessageIndex(null);
                                                    setEditedMessage('');
                                                }}
                                                disabled={isSavingEdit}
                                                sx={{ 
                                                    color: '#1976d2',
                                                    borderColor: '#1976d2',
                                                    '&:hover': {
                                                        borderColor: '#1565c0',
                                                        backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                                    }
                                                }}
                                            >
                                                Cancelar
                                            </MUI.Button>
                                            <MUI.Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleSaveEdit(index)}
                                                disabled={!editedMessage.trim() || isSavingEdit}
                                                sx={{ 
                                                    backgroundColor: '#1976d2',
                                                    '&:hover': {
                                                        backgroundColor: '#1565c0'
                                                    }
                                                }}
                                            >
                                                {isSavingEdit ? (
                                                    <MUI.Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <MUI.CircularProgress size={16} sx={{ color: '#fff', mr: 1 }} />
                                                        Salvando...
                                                    </MUI.Box>
                                                ) : 'Salvar'}
                                            </MUI.Button>
                                        </MUI.Box>
                                    </MUI.Box>
                                )}
                            </MUI.Box>
                        ))}

                        {isGrouping && !isProcessing && (
                            <MUI.Box display="flex" justifyContent="flex-end" mt={1}>
                                <MUI.Paper elevation={0} sx={{
                                    p: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#FFF59D',
                                    color: '#000'
                                }}>
                                    <MUI.CircularProgress size={16} sx={{ color: '#000' }} />
                                    <MUI.Typography variant="caption" ml={1}>
                                        Agrupando mensagens... ({pendingMessages.length})
                                    </MUI.Typography>
                                </MUI.Paper>
                            </MUI.Box>
                        )}


                    </MUI.Box>
                ) : (
                    <MUI.Typography variant="body1" textAlign="center" color="text.secondary">
                        Nenhuma mensagem recebida ainda.
                    </MUI.Typography>
                )}
            </MUI.Box>
        </MUI.Box>
    );
};

const mapStateToProps = (state: any) => ({
    copilotIA: state['copilot-ia']?.copilotIA
});

// Export the wrapped component
export const CopilotIA = connect(mapStateToProps)(withAuthorization(CopilotIAComponent));