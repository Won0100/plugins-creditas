import { copilotStorage } from './localStorage/actions';
import { copilotService } from '../services/copilotService';
import { TaskHelper } from '@twilio/flex-ui';

interface Message {
    message: string;
    author: string;
    isAI?: boolean;
    liked?: boolean;
    isClient?: boolean;
    isProcessing?: boolean;
    isEdited?: boolean;
    processed?: boolean;
    groupId?: string; // Add groupId to track message groups
    retryCount?: number; // Add retry counter
    isError?: boolean; // Add flag to identify error messages
}

interface TaskConversation {
    messages: Message[];
    isProcessing: boolean;
    conversationSid?: string;
    lastUpdated?: number;
    currentGrouping?: {
        timerStartedAt: number;
        groupId: string;
    };
    processingStartTime?: number;
}

// Singleton for background processing
class BackgroundMessageHandler {
    private static instance: BackgroundMessageHandler;
    private processingTasks: Set<string> = new Set();
    private readonly GROUPING_TIMEOUT = 15000; // 15 seconds in milliseconds
    private readonly PROCESSING_TIMEOUT = 30000; // 30 seconds timeout for processing


    private constructor() {
        console.log('[BackgroundHandler] Initializing background message handler...');
        this.startBackgroundProcessing();
    }

    public static getInstance(): BackgroundMessageHandler {
        if (!BackgroundMessageHandler.instance) {
            console.log('[BackgroundHandler] Creating new instance...');
            BackgroundMessageHandler.instance = new BackgroundMessageHandler();
        }
        return BackgroundMessageHandler.instance;
    }

    private startBackgroundProcessing(): void {
        console.log('[BackgroundHandler] Starting background processing loop...');
        setInterval(() => {
            this.processPendingMessages();
            this.checkProcessingTimeouts();
        }, 1000);
    }

    private generateGroupId(): string {
        return `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private startGroupingTimer(reservationSid: string): void {
        try {
            const conversations = copilotStorage.getConversations();
            console.log(`[BackgroundHandler] Retrieved conversations for grouping timer: ${Object.keys(conversations).length} total`);
            const conversation = conversations[reservationSid];
            
            if (conversation) {
                if (!conversation.currentGrouping) {
                    const groupId = this.generateGroupId();
                    conversation.currentGrouping = {
                        timerStartedAt: Date.now(),
                        groupId
                    };
                    copilotStorage.setConversations(conversations);
                    console.log(`[BackgroundHandler] Started grouping timer for ${reservationSid}, groupId: ${groupId}`);
                } else {
                    console.log(`[BackgroundHandler] Grouping already active for ${reservationSid}`);
                }
            } else {
                console.log(`[BackgroundHandler] No conversation found for ${reservationSid} when starting grouping timer`);
            }
        } catch (error) {
            console.error(`[BackgroundHandler] Error in startGroupingTimer for ${reservationSid}:`, error);
        }
    }

    private resetGroupingTimer(reservationSid: string): void {
        try {
            const conversations = copilotStorage.getConversations();
            const conversation = conversations[reservationSid];
            
            if (conversation && conversation.currentGrouping) {
                conversation.currentGrouping.timerStartedAt = Date.now();
                copilotStorage.setConversations(conversations);
                console.log(`[BackgroundHandler] Reset grouping timer for ${reservationSid}, groupId: ${conversation.currentGrouping.groupId}`);
            } else {
                console.log(`[BackgroundHandler] Cannot reset timer - no conversation or grouping for ${reservationSid}`);
            }
        } catch (error) {
            console.error(`[BackgroundHandler] Error in resetGroupingTimer for ${reservationSid}:`, error);
        }
    }

    private isGroupingActive(reservationSid: string): boolean {
        try {
            const conversations = copilotStorage.getConversations();
            const conversation = conversations[reservationSid];
            
            if (!conversation?.currentGrouping) return false;
            
            const timeSinceStart = Date.now() - conversation.currentGrouping.timerStartedAt;
            const remainingSeconds = Math.ceil((this.GROUPING_TIMEOUT - timeSinceStart) / 1000);
            
            if (remainingSeconds > 0) {
                console.log(`[BackgroundHandler] Grouping active for ${reservationSid}, groupId: ${conversation.currentGrouping.groupId}, ${remainingSeconds} seconds remaining`);
            }
            
            return timeSinceStart < this.GROUPING_TIMEOUT;
        } catch (error) {
            console.error(`[BackgroundHandler] Error checking grouping status for ${reservationSid}:`, error);
            return false;
        }
    }

    private checkProcessingTimeouts(): void {
        try {
            const conversations = copilotStorage.getConversations() as Record<string, TaskConversation>;
            let hasChanges = false;

            for (const [reservationSid, conversation] of Object.entries(conversations)) {
                if (conversation.isProcessing && conversation.processingStartTime) {
                    const processingTime = Date.now() - conversation.processingStartTime;
                    if (processingTime > this.PROCESSING_TIMEOUT) {
                        // Reset processing state
                        conversation.isProcessing = false;
                        conversation.processingStartTime = undefined;
                        conversation.messages = conversation.messages.map((msg: Message) => ({
                            ...msg,
                            isProcessing: false
                        }));
                        hasChanges = true;
                        console.log(`[BackgroundHandler] Reset processing state for ${reservationSid} due to timeout`);
                    }
                }
            }

            if (hasChanges) {
                copilotStorage.setConversations(conversations);
                console.log(`[BackgroundHandler] Updated ${Object.keys(conversations).length} conversations after timeout check`);
            }
        } catch (error) {
            console.error('[BackgroundHandler] Error in checkProcessingTimeouts:', error);
        }
    }

    private async processPendingMessages(): Promise<void> {
        try {
            const conversations = copilotStorage.getConversations() as Record<string, TaskConversation>;
            console.log(`[BackgroundHandler] Processing pending messages for ${Object.keys(conversations).length} conversations`);
            let hasChanges = false;

        // Process each conversation
        for (const [reservationSid, conversation] of Object.entries(conversations)) {
            // Debug log for groupingTimer value
            //console.log(`[BackgroundHandler][Debug] reservationSid: ${reservationSid}, groupingTimer: ${conversation.currentGrouping?.timerStartedAt}, now: ${Date.now()}`);

            // Skip if already processing
            if (this.processingTasks.has(reservationSid)) {
                continue;
            }

            const unprocessedMessages = conversation.messages.filter(
                (msg: Message) => !msg.processed && !msg.isAI && !msg.isProcessing && (!msg.retryCount || msg.retryCount < 3)
            );

            if (unprocessedMessages.length === 0) {
                continue;
            }

            // Check if any messages have retry attempts (failed before)
            const hasRetryAttempts = unprocessedMessages.some((msg: Message) => (msg.retryCount || 0) > 0);

            // If grouping is active and no retry attempts, wait for it to complete
            if (this.isGroupingActive(reservationSid) && !hasRetryAttempts) {
                continue;
            }

            // Only start grouping timer if it was never started for this batch and no retry attempts
            if (!conversation.currentGrouping && !hasRetryAttempts) {
                this.startGroupingTimer(reservationSid);
                console.log(`[BackgroundHandler] Starting new grouping period for ${reservationSid} with ${unprocessedMessages.length} messages`);
                hasChanges = true;
                continue;
            }

            // Process messages if timer expired, was started before, or if there are retry attempts
            const groupId = conversation.currentGrouping?.groupId || this.generateGroupId();
            const processingReason = hasRetryAttempts ? 'retry attempt' : 'grouping expired';
            console.log(`[BackgroundHandler] ${processingReason}, processing ${unprocessedMessages.length} messages for ${reservationSid}, groupId: ${groupId}`);
            this.processingTasks.add(reservationSid);

            try {
                const currentConversations = copilotStorage.getConversations();
                console.log(`[BackgroundHandler] Retrieved current conversations for processing: ${Object.keys(currentConversations).length} total`);
                const currentConversation = currentConversations[reservationSid];
                
                if (currentConversation) {
                    // Filter out duplicate messages within the same group
                    const uniqueMessages = unprocessedMessages.reduce((acc: Message[], current: Message) => {
                        const isDuplicate = acc.some(msg => 
                            msg.message === current.message && 
                            msg.author === current.author
                        );
                        
                        if (!isDuplicate) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);

                    // Remove duplicate messages from localStorage history
                    const deduplicatedMessages = currentConversation.messages.filter((msg: Message, index: number, self: Message[]) => {
                        // Keep AI messages
                        if (msg.isAI) return true;
                        
                        // For non-AI messages, check if it's a duplicate within the same group
                        const isDuplicate = self.findIndex((m: Message) => 
                            !m.isAI && 
                            m.message === msg.message && 
                            m.author === msg.author &&
                            m.groupId === msg.groupId
                        ) !== index;
                        
                        return !isDuplicate;
                    });

                    // Mark messages as processing and assign group ID
                    let updatedMessages = deduplicatedMessages.map((msg: Message) => {
                        if (!msg.processed && !msg.isAI) {
                            // Only mark as processing if it's in the unique messages list
                            const shouldProcess = uniqueMessages.some(uniqueMsg => 
                                uniqueMsg.message === msg.message && 
                                uniqueMsg.author === msg.author
                            );
                            return { 
                                ...msg, 
                                isProcessing: shouldProcess, 
                                groupId,
                                processed: !shouldProcess // Mark duplicates as processed
                            };
                        }
                        return msg;
                    });

                    // Insert AI processing placeholder if not already present
                    const hasProcessingPlaceholder = updatedMessages.some(
                        (msg: Message) => msg.isAI && msg.isProcessing && msg.groupId === groupId
                    );
                    if (!hasProcessingPlaceholder) {
                        updatedMessages.push({
                            message: "...",
                            author: "IA",
                            isAI: true,
                            isProcessing: true,
                            processed: false,
                            groupId
                        });
                    }

                    // Update conversation with deduplicated messages
                    currentConversations[reservationSid] = {
                        ...currentConversation,
                        messages: updatedMessages,
                        isProcessing: true,
                        processingStartTime: Date.now(),
                        lastUpdated: Date.now()
                    };
                    copilotStorage.setConversations(currentConversations);
                    console.log(`[BackgroundHandler] Updated conversation ${reservationSid} with ${updatedMessages.length} messages`);
                    hasChanges = true;

                    // Get AI response
                    const task = TaskHelper.getTaskByTaskSid(reservationSid);
                    if (!task) {
                        console.error(`[BackgroundHandler] No task found for ${reservationSid}, skipping processing.`);
                        // Clear groupingTimer so next batch can start
                        const skipConversations = copilotStorage.getConversations();
                        const skipConversation = skipConversations[reservationSid];
                        if (skipConversation) {
                            skipConversations[reservationSid] = {
                                ...skipConversation,
                                isProcessing: false,
                                processingStartTime: undefined,
                                currentGrouping: undefined,
                                lastUpdated: Date.now()
                            };
                            copilotStorage.setConversations(skipConversations);
                            console.log(`[BackgroundHandler] Cleared processing state for ${reservationSid} - no task found`);
                        }
                        this.processingTasks.delete(reservationSid);
                        continue;
                    }

                    // Concatenate all messages in the group
                    const concatenatedMessage = uniqueMessages
                        .map(msg => msg.message)
                        .join(' , ');

                    const aiData = await copilotService.getAIResponse(
                        concatenatedMessage,
                        uniqueMessages[uniqueMessages.length - 1].author, // Use the last message's author
                        task
                    );

                    // Process messages after getting AI response
                    const finalConversations = copilotStorage.getConversations();
                    console.log(`[BackgroundHandler] Retrieved final conversations after AI response`);
                    const finalConversation = finalConversations[reservationSid];

                    if (finalConversation) {
                        // Replace the processing placeholder with the real AI response
                        const finalMessages = finalConversation.messages.map((msg: Message) => {
                            if (msg.isAI && msg.isProcessing && msg.groupId === groupId) {
                                return {
                                    ...msg,
                                    message: aiData.aiResponse,
                                    agentName: aiData.agentName,
                                    isProcessing: false,
                                    processed: true,
                                    isError: aiData.isError || false
                                };
                            }
                            // Mark all client messages in this group as processed
                            if (msg.groupId === groupId && !msg.isAI) {
                                return { ...msg, processed: true, isProcessing: false };
                            }
                            return msg;
                        });

                        // Update conversation
                        finalConversations[reservationSid] = {
                            ...finalConversation,
                            messages: finalMessages,
                            isProcessing: false,
                            processingStartTime: undefined,
                            lastUpdated: Date.now(),
                            currentGrouping: undefined // clear grouping after processing
                        };

                        copilotStorage.setConversations(finalConversations);
                        console.log(`[BackgroundHandler] Saved final conversation state for ${reservationSid}`);
                        hasChanges = true;
                        console.log(`[BackgroundHandler] Completed processing group ${groupId} for ${reservationSid}`);
                    }
                }
            } catch (error) {
                console.error(`[BackgroundHandler] Error processing messages for ${reservationSid}:`, error);
                // Reset processing state on error
                const errorConversations = copilotStorage.getConversations();
                console.log(`[BackgroundHandler] Retrieved conversations for error handling`);
                const errorConversation = errorConversations[reservationSid];
                if (errorConversation) {
                    // Remove the processing placeholder message
                    const resetMessages = errorConversation.messages
                        .filter((msg: Message) => !(msg.isAI && msg.isProcessing && msg.groupId === groupId))
                        .map((msg: Message) => {
                            if (msg.groupId === groupId && !msg.isAI) {
                                const newRetryCount = (msg.retryCount || 0) + 1;
                                return {
                                    ...msg,
                                    isProcessing: false,
                                    retryCount: newRetryCount,
                                    processed: true // Mark as processed since we're handling the error
                                };
                            }
                            return msg;
                        });

                    // Add error message immediately on first error
                    resetMessages.push({
                        message: "[Erro na sugestão da IA]",
                        author: "IA",
                        isAI: true,
                        isProcessing: false,
                        processed: true,
                        groupId,
                        liked: false,
                        isEdited: false,
                        isError: true
                    });

                    // Check if we should preserve grouping for retries (but we're not retrying anymore)
                    const shouldPreserveGrouping = false;

                    errorConversations[reservationSid] = {
                        ...errorConversation,
                        messages: resetMessages,
                        isProcessing: false,
                        processingStartTime: undefined,
                        lastUpdated: Date.now(),
                        currentGrouping: shouldPreserveGrouping ? errorConversation.currentGrouping : undefined // preserve grouping for retries
                    };
                    copilotStorage.setConversations(errorConversations);
                    console.log(`[BackgroundHandler] Saved error state for conversation ${reservationSid}`);
                    hasChanges = true;
                }
            } finally {
                this.processingTasks.delete(reservationSid);
            }
        }

            // Only update lastUpdated if there were actual changes
            if (hasChanges) {
                const conversations = copilotStorage.getConversations() as Record<string, TaskConversation>;
                for (const [reservationSid, conversation] of Object.entries(conversations)) {
                    if (conversation.isProcessing || this.isGroupingActive(reservationSid)) {
                        conversation.lastUpdated = Date.now();
                    }
                }
                copilotStorage.setConversations(conversations);
                console.log(`[BackgroundHandler] Final update completed for all conversations`);
            }
        } catch (error) {
            console.error('[BackgroundHandler] Error in processPendingMessages:', error);
        }
    }

    // Public method to handle new messages
    public handleNewMessage(reservationSid: string): void {
        if (this.isGroupingActive(reservationSid)) {
            this.resetGroupingTimer(reservationSid);
            console.log(`[BackgroundHandler] Reset grouping timer for new message in ${reservationSid}`);
        } else {
            this.startGroupingTimer(reservationSid);
            console.log(`[BackgroundHandler] Started new grouping timer for ${reservationSid}`);
        }
    }

    // Add cleanup method to be called when component unmounts
    public cleanup() {
        // Cleanup method kept for compatibility but no longer manages cleanup intervals
        // Conversation cleanup is now handled by ConversationCleanupHandler
    }
}

// Export singleton instance
export const backgroundMessageHandler = BackgroundMessageHandler.getInstance(); 