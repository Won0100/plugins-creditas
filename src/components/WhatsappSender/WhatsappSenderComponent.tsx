import React, { useState, useEffect } from 'react';
import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';
import { Manager } from '@twilio/flex-ui';
import { CustomInput } from '../Custom/CustomInput';
import { CustomSelect } from '../Custom/CustomSelect';
import { CustomButton } from '../Custom/CustomButton';
import { serviceContent } from '../../services/content';
import { whatsappResponseHandler } from '../../services/whatsappResponseHandler';
import { useSnackbar } from '../../hooks/useSnackbar';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ConversationsService } from '../../services/conversations';
import { getDocument } from '../../services/sync';
import { useTheme } from '@mui/material/styles';

interface ContentTemplate {
  sid: string;
  name: string;
  teams?: string[];
  variables?: { [key: string]: string };
  types?: {
    [key: string]: {
      body: string;
    };
  };
  translations?: {
    [language: string]: {
      text: string;
      status: string;
      locale: string;
    };
  };
  body?: string;
  content?: string;
}

interface WhatsappSenderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const WhatsappSender: React.FC<WhatsappSenderProps> = ({ isOpen, onToggle }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [senders, setSenders] = useState<any[]>([]);
  const [selectedSender, setSelectedSender] = useState('');
  const [variables, setVariables] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templateDetailsLoading, setTemplateDetailsLoading] = useState(false);
  const [sendersLoading, setSendersLoading] = useState(false);
  const [previewText, setPreviewText] = useState<string>('');
  const { throwAlert } = useSnackbar();

  const manager = Manager.getInstance();

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      loadSenders();
    }
  }, [isOpen]);





  // Update preview when template or variables change
  useEffect(() => {
    const template = selectedTemplate as any;
    
    // Try different possible template body locations based on actual Twilio Content API structure
    let templateBody = '';
    
    // Check for Twilio Content API template structure
    if (template?.types?.['twilio/list-picker']?.body) {
      templateBody = template.types['twilio/list-picker'].body;
    } else if (template?.types?.['twilio/quick-reply']?.body) {
      templateBody = template.types['twilio/quick-reply'].body;
    } else if (template?.types?.['twilio/call-to-action']?.body) {
      templateBody = template.types['twilio/call-to-action'].body;
    } else if (template?.types?.['twilio/text']?.body) {
      templateBody = template.types['twilio/text'].body;
    } else if (template?.types?.whatsapp?.body) {
      templateBody = template.types.whatsapp.body;
    } else if (template?.types?.text?.body) {
      templateBody = template.types.text.body;
    } else if (template?.translations?.en?.text) {
      templateBody = template.translations.en.text;
    } else if (template?.translations?.pt?.text) {
      templateBody = template.translations.pt.text;
    } else if (template?.body) {
      templateBody = template.body;
    } else if (template?.content) {
      templateBody = template.content;
    }
    
    if (templateBody) {
      const preview = renderTemplatePreview(templateBody, variables);
      setPreviewText(preview);
    } else {
      setPreviewText('');
    }
  }, [selectedTemplate, variables]);

  const loadTemplates = async () => {
    setTemplatesLoading(true);
    try {
      // First, get the allowed template IDs from sync document
      let allowedTemplateIds: string[] = [];
      let shouldFilterTemplates = false;
      
      try {
        const syncDocument = await getDocument.whatsappSenderTemplates();
        
        if (syncDocument && syncDocument.data && syncDocument.data.templates && Array.isArray(syncDocument.data.templates)) {
          allowedTemplateIds = syncDocument.data.templates;
          shouldFilterTemplates = allowedTemplateIds.length > 0;
          console.log('WhatsApp Sender Templates Sync Document loaded:', allowedTemplateIds);
        } else {
          console.log('No WhatsApp Sender Templates Sync Document found or empty, showing all templates');
        }
      } catch (syncError) {
        console.warn('Error loading WhatsApp Sender Templates Sync Document:', syncError);
        // Continue with loading all templates if sync fails
      }
      
      const response = await serviceContent.get();
      if (response?.contents) {
        // Filter out templates with empty or null names and add fallback names
        let validTemplates = response.contents.filter((template: any) => {
          // Check for different possible name fields
          const templateName = template.name || template.friendly_name || template.friendlyName;
          const isValid = templateName && 
            templateName.trim() !== '' && 
            template.sid;
          
          if (isValid) {
            // Ensure the template has a proper name
            template.name = templateName.trim();
          }
          
          return isValid;
        });
        
        // Filter templates based on sync document if available
        if (shouldFilterTemplates) {
          const originalCount = validTemplates.length;
          validTemplates = validTemplates.filter((template: any) => 
            allowedTemplateIds.includes(template.sid)
          );
          console.log(`Filtered templates: ${originalCount} -> ${validTemplates.length} (allowed: ${allowedTemplateIds.length})`);
        }
        
        setTemplates(validTemplates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      throwAlert('error', 'Erro ao carregar templates');
    } finally {
      setTemplatesLoading(false);
    }
  };

  const loadSenders = async () => {
    setSendersLoading(true);
    try {
      const response = await serviceContent.getSenders();
      
      if (response && typeof response === 'object' && 'addresses' in response && Array.isArray(response.addresses)) {
        const whatsappSenders = response.addresses.filter(
          (sender: any) => sender.type === 'whatsapp'
        );
        
        // Load worker-specific numbers from sync document
        let workerNumbers: string[] = [];
        try {
          const workerNumbersDocument = await getDocument.whatsappSenderWorkerNumbers();

          
          if (workerNumbersDocument && workerNumbersDocument.data) {
            // Try to get the user's email from different sources
            const currentUserIdentity = manager.user.identity;
            const currentUserEmail = manager.workerClient?.attributes?.email;

            
            // Find numbers for the current user
            if (currentUserEmail && workerNumbersDocument.data[currentUserEmail]) {
              workerNumbers = workerNumbersDocument.data[currentUserEmail];
            }
          }
        } catch (syncError) {
          console.warn('Error loading worker numbers from sync document:', syncError);
        }
        
        // Create sender objects for worker numbers
        const workerSenders = workerNumbers.map((phoneNumber, index) => ({
          sid: `worker_${index}`,
          address: phoneNumber,
          friendly_name: `Número EXCLUSIVO (${phoneNumber})`,
          type: 'whatsapp'
        }));
        
        // Combine both regular senders and worker-specific senders
        const allSenders = [...whatsappSenders, ...workerSenders];
        
        console.log('All senders loaded:', {
          regularSenders: whatsappSenders.length,
          workerSenders: workerSenders.length,
          totalSenders: allSenders.length,
          currentUser: manager.user.identity,
          currentUserEmail: manager.workerClient?.attributes?.email || 'not found'
        });
        
        setSenders(allSenders);
        if (allSenders.length > 0) {
          setSelectedSender(allSenders[0].sid);
        }
      } else {
        throwAlert('error', 'Estrutura de resposta inválida ao carregar remetentes');
      }
    } catch (error) {
      console.error('Error loading senders:', error);
      throwAlert('error', 'Erro ao carregar remetentes');
    } finally {
      setSendersLoading(false);
    }
  };



  const loadTemplateDetails = async (templateSid: string) => {
    setTemplateDetailsLoading(true);
    try {
      const details = await serviceContent.getTemplateDetails(templateSid);
      
      if (details) {
        // Update the template with detailed information
        setTemplates(prev => prev.map(template => 
          template.sid === templateSid 
            ? { ...template, ...details }
            : template
        ));
        
        // Update selected template with details
        setSelectedTemplate(prev => {
          if (prev?.sid === templateSid) {
            const updatedTemplate = { ...prev, ...details };
            return updatedTemplate;
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error loading template details:', error);
    } finally {
      setTemplateDetailsLoading(false);
    }
  };

  const handleTemplateChange = async (templateSid: string) => {
    const template = templates.find(t => t.sid === templateSid);
    setSelectedTemplate(template || null);
    
    // Log the complete template structure for debugging
    console.log('=== SELECTED TEMPLATE STRUCTURE ===');
    console.log('Template SID:', templateSid);
    console.log('Complete template object:', JSON.stringify(template, null, 2));
    console.log('Template types:', template?.types);
    console.log('Template translations:', template?.translations);
    console.log('Template variables:', template?.variables);
    console.log('Template body fields:', {
      'types.twilio/list-picker.body': template?.types?.['twilio/list-picker']?.body,
      'types.twilio/quick-reply.body': template?.types?.['twilio/quick-reply']?.body,
      'types.twilio/call-to-action.body': template?.types?.['twilio/call-to-action']?.body,
      'types.whatsapp.body': template?.types?.whatsapp?.body,
      'types.text.body': template?.types?.text?.body,
      'translations.en.text': template?.translations?.en?.text,
      'translations.pt.text': template?.translations?.pt?.text,
      'body': template?.body,
      'content': template?.content
    });
    console.log('=== END TEMPLATE STRUCTURE ===');
    
    // Reset variables when template changes
    setVariables({});
    
    // Load template details if not already loaded
    if (template && !template.types) {
      await loadTemplateDetails(templateSid);
    }
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables(prev => {
      const newVariables = {
        ...prev,
        [key]: value
      };
      return newVariables;
    });
  };

  const renderTemplatePreview = (templateBody: string, variables: { [key: string]: string }) => {
    let previewText = templateBody;
    
    // Replace all variables in the template with their values
    for (const [key, value] of Object.entries(variables)) {
      if (value && value.trim() !== '') {
        // Use a simple string replacement approach instead of regex
        const placeholder = `{{${key}}}`;
        previewText = previewText.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
      }
    }
    
    // Highlight any remaining variables that haven't been filled
    const remainingVars = previewText.match(/\{\{([^}]+)\}\}/g);
    if (remainingVars) {
      remainingVars.forEach(varName => {
        const regex = new RegExp(varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        previewText = previewText.replace(regex, `${varName} (preencher)`);
      });
    }
    
    return previewText;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    try {
      const parsed = parsePhoneNumberFromString(phone, 'BR');
      return parsed?.isValid() || false;
    } catch {
      return false;
    }
  };

  const formatPhoneNumberTemplate = (phone: string): string => {
    try {
      const parsed = parsePhoneNumberFromString(phone, 'BR');
      return parsed?.format('E.164').replace('+', '') || phone.replace(/\D/g, '');
    } catch {
      return phone.replace(/\D/g, '');
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    if (phone.startsWith('whatsapp:')) {
      return phone;
    } else {
      if (phone.includes('+55')) {
        return `whatsapp:${phone}`;
      } else {
        return `whatsapp:+55${phone}`;
      }
    }
  };

  const handleSend = async () => {
    if (!phoneNumber.trim()) {
      throwAlert('error', 'Digite um número de telefone');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      throwAlert('error', 'Número de telefone inválido');
      return;
    }

    if (!selectedTemplate) {
      throwAlert('error', 'Selecione um template');
      return;
    }

    if (!selectedSender) {
      throwAlert('error', 'Selecione um remetente');
      return;
    }

    // Check if all required variables are filled
    if (selectedTemplate.variables) {
      const missingVariables = Object.keys(selectedTemplate.variables).filter(
        key => !variables[key] || variables[key].trim() === ''
      );
      
      if (missingVariables.length > 0) {
        throwAlert('error', `Preencha todas as variáveis: ${missingVariables.join(', ')}`);
        return;
      }
    }

    // Check if Studio Flow are configured before sending
    const flowSid = process.env.FLEX_APP_TEMPLATE_STUDIO_FLOW;
    
    
    if (!flowSid) {
      throwAlert('warning', 'Studio Flow não configurado. Não é possível enviar template sem fluxo.');
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const sender = senders.find(s => s.sid === selectedSender);
      const senderAddress = sender?.address || selectedSender;
      
      // For worker senders, use the address directly as it's already a phone number
      const finalSenderAddress = sender?.sid.startsWith('worker_') 
        ? sender.address 
        : senderAddress;
      
      // Send the template message using default messaging service
      const response = await serviceContent.sendContentTemplate({
        content_sid: selectedTemplate.sid,
        to: formatPhoneNumberTemplate(phoneNumber),
        from: finalSenderAddress,
        variables
      });

      if (response?.sid) {
        // Register the agent mapping for response routing
        const agentId = manager.workerClient?.sid || '';
        const agentName = manager.workerClient?.friendlyName || manager.user.identity;
        const agentEmail = manager.workerClient?.attributes?.email || '';
        
        whatsappResponseHandler.registerOutgoingMessage(
          agentId,
          agentName,
          agentEmail,
          formattedPhone
        );

        // Create a conversation for the customer after successful message send
        try {
          const conversationsService = new ConversationsService();
          
          // Create conversation attributes using default messaging service
          const conversationAttributes = {
            friendlyName: `WhatsApp - ${variables.customerName || variables.name || 'Cliente'} (${formattedPhone})`,
            uniqueName: `whatsapp_${formattedPhone}_${Date.now()}`,
            attributes: {
              channelType: 'whatsapp',
              direction: 'outbound',
              templateSid: selectedTemplate.sid,
              templateName: selectedTemplate.name,
              messageSid: response.sid,
              agentId: agentId,
              agentName: agentName,
              agentEmail: agentEmail,
              customerPhone: formattedPhone,
              customerName: variables.customerName || variables.name || 'Cliente',
              templateVariables: variables,
              senderAddress: finalSenderAddress,
              createdAt: new Date().toISOString()
            }
          };

          const conversationResult = await conversationsService.createConversation(conversationAttributes);
          
          if (conversationResult.success) {
            console.log('Conversation created successfully:', conversationResult.data);
            
            // Add the customer as a participant with proper WhatsApp binding
            const participantResult = await conversationsService.addParticipant(conversationResult.data.sid, {
              messagingBindingAddress: formattedPhone,
              messagingBindingProxyAddress: `whatsapp:${finalSenderAddress}`,
              attributes: {
                role: 'customer',
                phone: formattedPhone,
                name: variables.customerName || variables.name || 'Cliente'
              }
            });
            
            if (participantResult.success) {
              console.log('Customer participant added successfully:', participantResult.data);
              
              // Add Studio Flow webhook to direct the conversation to a specific flow
              const flowSid = process.env.FLEX_APP_TEMPLATE_STUDIO_FLOW;
              if (flowSid) {
                const webhookResult = await conversationsService.addStudioFlowWebhook(conversationResult.data.sid, flowSid);
                
                if (webhookResult.success) {
                  console.log('Studio Flow webhook added successfully:', webhookResult.data);
                  throwAlert('success', 'Mensagem enviada, conversa criada e fluxo configurado com sucesso!');
                } else {
                  console.error('Failed to add Studio Flow webhook:', webhookResult.message);
                  throwAlert('warning', 'Mensagem enviada e conversa criada, mas falha ao configurar fluxo');
                }
              } else {
                console.warn('No Studio Flow SID configured, skipping webhook creation');
                throwAlert('success', 'Mensagem enviada e conversa criada com sucesso!');
              }
            } else {
              console.error('Failed to add customer participant:', participantResult.message);
              throwAlert('warning', 'Mensagem enviada e conversa criada, mas falha ao adicionar participante');
            }
          } else {
            console.error('Failed to create conversation:', conversationResult.message);
            throwAlert('warning', 'Mensagem enviada, mas falha ao criar conversa');
          }
        } catch (conversationError) {
          console.error('Error creating conversation:', conversationError);
          throwAlert('warning', 'Mensagem enviada, mas erro ao criar conversa');
        }

        setPhoneNumber('');
        setSelectedTemplate(null);
        setVariables({});
        
        // Close the sender panel
        onToggle();
      } else if (response?.error) {
        console.error('Twilio API Error:', response.error);
        throwAlert('error', `Erro ao enviar mensagem: ${response.error}`);
      } else {
        throwAlert('error', 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throwAlert('error', 'Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };



  const templateOptions = templates
    .filter(template => template.name && template.name.trim() !== '')
    .map(template => ({
      label: template.name.trim(),
      value: template.sid
    }));

  const senderOptions = senders.map(sender => {
    // Check if this is a worker sender (has worker_ prefix in sid)
    const isWorkerSender = sender.sid.startsWith('worker_');
    const label = isWorkerSender 
      ? `Número EXCLUSIVO (${sender.address})`
      : `${sender.friendly_name || 'Sem nome'} (${sender.address})`;
    
    return {
      label,
      value: sender.sid
    };
  });

  if (!isOpen) {
    return null;
  }

  const theme = useTheme();
  
  // Get the Twilio Flex theme background color
  const getTwilioBackgroundColor = () => {
    const manager = Manager.getInstance();
    const flexTheme = manager.configuration.theme as any;
    console.log('flexTheme', flexTheme);
    return flexTheme?.colors?.completeTaskColor || 'background.paper';
  };

  console.log('getTwilioBackgroundColor', getTwilioBackgroundColor());

  return (
    <MUI.Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? 'rgb(18, 28, 45)' : '#ffffff',
        border: '1px solid',
        borderColor: getTwilioBackgroundColor(),
        borderRadius: 1,
        p: 2,
        mb: 2,
        boxShadow: 1
      }}
    >
      <MUI.Stack spacing={2}>

        <CustomInput
          label="Número de telefone"
          placeholder="Digite o número (ex: 11999999999)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          Icon={MUIIcon.Phone}
          type="tel"
          required
          width="max"
          disabled={loading}
        />

        <CustomSelect
          label="Template"
          placeholder={templatesLoading ? "Carregando templates..." : templates.length === 0 ? "Nenhum template encontrado" : "Selecione um template"}
          value={selectedTemplate?.sid || ''}
          setValue={handleTemplateChange}
          options={templateOptions}
          Icon={MUIIcon.Message}
          required
          disabled={templatesLoading || templates.length === 0 || loading}
          width="max"
        />
        
        
        {templates.length === 0 && !templatesLoading && (
          <MUI.Typography variant="caption" color="warning.main" sx={{ mt: -1 }}>
            Nenhum template encontrado. Verifique a configuração de sincronização ou se há templates disponíveis.
          </MUI.Typography>
        )}

        {selectedTemplate && (
          <MUI.Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? 'rgb(18, 28, 45)' : '#ffffff', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <MUI.Typography variant="subtitle2" gutterBottom>
              Template selecionado: {selectedTemplate.name}
            </MUI.Typography>
            
            {/* Template Preview with Variables */}
            {(() => {
              const template = selectedTemplate as any;
              const templateBody = template?.types?.['twilio/list-picker']?.body || 
                                 template?.types?.['twilio/quick-reply']?.body ||
                                 template?.types?.['twilio/call-to-action']?.body ||
                                 template?.types?.['twilio/text']?.body ||
                                 template?.types?.whatsapp?.body || 
                                 template?.types?.text?.body || 
                                 template?.translations?.en?.text || 
                                 template?.translations?.pt?.text || 
                                 template?.body || 
                                 template?.content;
              
              // Get quick reply actions if available
              const quickReplyActions = template?.types?.['twilio/quick-reply']?.actions || [];
              
              // Get call-to-action buttons if available
              const callToActionButtons = template?.types?.['twilio/call-to-action']?.actions || [];
              
              return templateBody ? (
                <MUI.Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.mode === 'dark' ? 'rgb(18, 28, 45)' : '#ffffff', borderRadius: 1, border: '1px solid', borderColor: getTwilioBackgroundColor() }}>
                  <MUI.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <MUI.Typography variant="subtitle2" color="primary">
                      Preview da mensagem:
                    </MUI.Typography>
                    <MUI.Typography variant="caption" color="text.secondary">
                      {previewText.length} caracteres
                    </MUI.Typography>
                  </MUI.Box>
                  <MUI.Typography 
                    variant="body2" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgb(18, 28, 45)' : '#ffffff',
                      color: 'text.primary',
                      p: 1,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: previewText.includes('(preencher)') ? 'error.main' : 'divider',
                      minHeight: '60px'
                    }}
                  >
                    {previewText}
                  </MUI.Typography>
                  
                  {/* Quick Reply Buttons Preview */}
                  {quickReplyActions.length > 0 && (
                    <MUI.Box sx={{ mt: 2 }}>
                      <MUI.Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Botões de resposta:
                      </MUI.Typography>
                      <MUI.Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {quickReplyActions.map((action: any, index: number) => (
                          <MUI.Button
                            key={action.id || index}
                            variant="outlined"
                            size="small"
                            disabled
                            sx={{
                              minWidth: 'auto',
                              px: 2,
                              py: 0.5,
                              fontSize: '0.75rem',
                              borderColor: 'primary.main',
                              color: 'primary.main',
                              '&:disabled': {
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                opacity: 0.7
                              }
                            }}
                          >
                            {action.title}
                          </MUI.Button>
                        ))}
                      </MUI.Stack>
                    </MUI.Box>
                  )}
                  
                  {/* Call-to-Action Buttons Preview */}
                  {callToActionButtons.length > 0 && (
                    <MUI.Box sx={{ mt: 2 }}>
                      <MUI.Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Botões de ação:
                      </MUI.Typography>
                      <MUI.Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {callToActionButtons.map((action: any, index: number) => (
                          <MUI.Button
                            key={action.id || index}
                            variant="outlined"
                            size="small"
                            disabled
                            sx={{
                              minWidth: 'auto',
                              px: 2,
                              py: 0.5,
                              fontSize: '0.75rem',
                              borderColor: 'success.main',
                              color: 'success.main',
                              '&:disabled': {
                                borderColor: 'success.main',
                                color: 'success.main',
                                opacity: 0.7
                              }
                            }}
                          >
                            {action.title}
                          </MUI.Button>
                        ))}
                      </MUI.Stack>
                    </MUI.Box>
                  )}
                  
                  {previewText.includes('(preencher)') && (
                    <MUI.Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                      ⚠️ Preencha todas as variáveis antes de enviar
                    </MUI.Typography>
                  )}
                </MUI.Box>
              ) : (
                <MUI.Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
                  <MUI.Typography variant="caption" color="warning.contrastText">
                    ⚠️ Template body não carregado. Tentando carregar detalhes...
                  </MUI.Typography>
                  {templateDetailsLoading && (
                    <MUI.CircularProgress size={16} sx={{ ml: 1 }} />
                  )}
                </MUI.Box>
              );
            })()}
            
            {selectedTemplate.variables && Object.keys(selectedTemplate.variables).length > 0 && (
              <MUI.Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Variáveis disponíveis: {Object.keys(selectedTemplate.variables).join(', ')}
              </MUI.Typography>
            )}
            {templateDetailsLoading && (
              <MUI.CircularProgress size={16} sx={{ ml: 1 }} />
            )}
          </MUI.Box>
        )}

                    {selectedTemplate?.variables && Object.keys(selectedTemplate.variables).length > 0 && (
              <MUI.Box>
                <MUI.Typography variant="subtitle2" gutterBottom>
                  Variáveis do template:
                </MUI.Typography>
                <MUI.Stack spacing={1}>
                  {Object.keys(selectedTemplate.variables).map(key => (
                    <MUI.Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MUI.Typography variant="caption" color="text.secondary" sx={{ minWidth: '80px' }}>
                        {key}:
                      </MUI.Typography>
                      <CustomInput
                        value={variables[key] || ''}
                        onChange={(e) => handleVariableChange(key, e.target.value)}
                        type="text"
                        placeholder={`Digite o valor para ${key}`}
                        sx={{ flexGrow: 1 }}
                        disabled={loading}
                      />
                    </MUI.Box>
                  ))}
                </MUI.Stack>

              </MUI.Box>
            )}

        <CustomSelect
          label="Remetente"
          placeholder={sendersLoading ? "Carregando remetentes..." : senders.length === 0 ? "Nenhum remetente encontrado" : "Selecione um remetente"}
          value={selectedSender}
          setValue={setSelectedSender}
          options={senderOptions}
          Icon={MUIIcon.Person}
          required
          disabled={sendersLoading || senders.length === 0 || loading}
          width="max"
        />




        <MUI.Stack direction="row" spacing={1}>
          <CustomButton
            value="Enviar"
            Icon={MUIIcon.Send}
            onClick={handleSend}
            loading={loading}
            disabled={!phoneNumber || !selectedTemplate || !selectedSender || loading}
            color="success"
            width="auto"
          />
          <MUI.Button
            variant="contained"
            color="error"
            onClick={onToggle}
            startIcon={<MUIIcon.Close />}
            disabled={loading}
            sx={{ 
              minWidth: 'auto'
            }}
          >
            Cancelar
          </MUI.Button>
        </MUI.Stack>
      </MUI.Stack>
    </MUI.Box>
  );
}; 