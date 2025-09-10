import { Manager } from '@twilio/flex-ui';

/**
 * ConversationsService for managing Twilio Conversations API
 * 
 * This service now supports multiple conversations with the same WhatsApp number
 * by using different proxy addresses. Each (customer phone, proxy phone) pair
 * can have its own conversation, allowing for different departments or purposes
 * to have separate conversations with the same customer.
 */
export class ConversationsService {
  private manager: Manager;
  private baseUrl = 'https://conversations.twilio.com/v1';

  constructor() {
    this.manager = Manager.getInstance();
  }

  async createConversation(attributes: any) {
    try {
      const accountSid = this.manager.serviceConfiguration.account_sid;
      const authToken = this.manager.serviceConfiguration.attributes.auth_token;

      console.log('attributes', attributes);
      
      // Note: We no longer automatically close existing conversations
      // This allows multiple conversations with the same WhatsApp number using different proxy addresses
      // Conflicts will be handled in addParticipant when the specific (customer, proxy) pair already exists
      
      // Prepare the request body with stringified attributes
      const requestBody = new URLSearchParams();
      
      if (attributes.friendlyName) {
        requestBody.append('FriendlyName', attributes.friendlyName);
      }
      if (attributes.uniqueName) {
        requestBody.append('UniqueName', attributes.uniqueName);
      }
      if (attributes.messagingServiceSid) {
        requestBody.append('MessagingServiceSid', attributes.messagingServiceSid);
      }
      if (attributes.attributes) {
        requestBody.append('Attributes', JSON.stringify(attributes.attributes));
      }
      
      const response = await fetch(`${this.baseUrl}/Conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        },
        body: requestBody.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[ConversationsService] API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          requestBody: requestBody.toString(),
        });
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('[ConversationsService] Error creating conversation:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async addParticipant(conversationSid: string, attributes: {
    identity?: string;
    messagingBindingAddress?: string;
    messagingBindingProxyAddress?: string;
    attributes?: Record<string, any>;
  }, retryCount: number = 0): Promise<{ success: boolean; data?: any; message?: string }> {
    // Prevent infinite loops by limiting retries
    const MAX_RETRIES = 3;
    
    try {
      const accountSid = this.manager.serviceConfiguration.account_sid;
      const authToken = this.manager.serviceConfiguration.attributes.auth_token;
      
      // Prepare the request body with stringified attributes
      const requestBody = new URLSearchParams();
      
      if (attributes.identity) {
        requestBody.append('Identity', attributes.identity);
      }
      
      // For SMS participants, both address and proxy address are required
      if (attributes.messagingBindingAddress) {
        // Ensure phone number is in E.164 format
        requestBody.append('MessagingBinding.Address', attributes.messagingBindingAddress);
      }
      
      if (attributes.messagingBindingProxyAddress) {
        // Ensure proxy phone number is in E.164 format
        let proxyNumber = attributes.messagingBindingProxyAddress;
        requestBody.append('MessagingBinding.ProxyAddress', proxyNumber);
      }
      
      
      const response = await fetch(`${this.baseUrl}/Conversations/${conversationSid}/Participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        },
        body: requestBody.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[ConversationsService] API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          requestBody: requestBody.toString(),
        });
        
        // Handle 50416 error - binding already exists
        if (errorData.code === 50416 && errorData.status === 409) {
          console.log('[ConversationsService] Binding already exists, checking for specific (customer, proxy) conflict...');
          console.log('[ConversationsService] Error message:', errorData.message);
          
          // Check if we've exceeded retry limit
          if (retryCount >= MAX_RETRIES) {
            console.error('[ConversationsService] Maximum retries exceeded. Returning error.');
            return {
              success: false,
              message: `Maximum retries (${MAX_RETRIES}) exceeded for participant addition. Binding conflict persists.`,
            };
          }
          
          // Extract the specific conversation ID from the error message
          // The error message format is: "A binding for this participant and proxy address already exists in Conversation CHc31ceaf4b2d444a898530b3e44934ffe"
          console.log('[ConversationsService] Attempting to extract conversation ID from message:', errorData.message);
          const messageMatch = errorData.message.match(/Conversation ([A-Za-z0-9]+)/);
          console.log('[ConversationsService] Regex match result:', messageMatch);
          
          if (messageMatch && messageMatch[1]) {
            const conflictingConversationSid = messageMatch[1];
            console.log('[ConversationsService] Found conflicting conversation from error message:', conflictingConversationSid);
            
            // Close the specific conflicting conversation
            const closeResult = await this.closeConversation(conflictingConversationSid);
            if (closeResult.success) {
              console.log('[ConversationsService] Conflicting conversation closed successfully, waiting before retry...');
              
              // Wait longer for the conversation to fully close and binding to be released
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              // Retry adding the participant to the original conversation
              console.log(`[ConversationsService] Retrying participant addition... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
              return await this.addParticipant(conversationSid, attributes, retryCount + 1);
            } else {
              console.error('[ConversationsService] Failed to close conflicting conversation:', closeResult.message);
              return {
                success: false,
                message: `Failed to close conflicting conversation: ${closeResult.message}`,
              };
            }
          } else {
            console.error('[ConversationsService] Could not extract conversation ID from error message:', errorData.message);
            
            // Try alternative regex patterns
            const alternativeMatch = errorData.message.match(/Conversation\s+([A-Za-z0-9]+)/);
            if (alternativeMatch && alternativeMatch[1]) {
              const conflictingConversationSid = alternativeMatch[1];
              console.log('[ConversationsService] Found conflicting conversation (alternative regex):', conflictingConversationSid);
              
              // Close the conflicting conversation first
              const closeResult = await this.closeConversation(conflictingConversationSid);
              if (closeResult.success) {
                console.log('[ConversationsService] Conflicting conversation closed successfully, waiting before retry...');
                
                // Wait longer for the conversation to fully close and binding to be released
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Retry adding the participant to the original conversation
                console.log(`[ConversationsService] Retrying participant addition... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
                return await this.addParticipant(conversationSid, attributes, retryCount + 1);
              } else {
                console.error('[ConversationsService] Failed to close conflicting conversation:', closeResult.message);
                return {
                  success: false,
                  message: `Failed to close conflicting conversation: ${closeResult.message}`,
                };
              }
            }
            
            return {
              success: false,
              message: `Could not extract conversation ID from error message: ${errorData.message}`,
            };
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('[ConversationsService] Error adding participant:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getConversationsByParticipant(phoneNumber: string) {
    try {
      const accountSid = this.manager.serviceConfiguration.account_sid;
      const authToken = this.manager.serviceConfiguration.attributes.auth_token;
      
      // Use the participant conversations endpoint to get conversations for this phone number
      const response = await fetch(`${this.baseUrl}/ParticipantConversations?Address=${encodeURIComponent(phoneNumber)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[ConversationsService] Error getting participant conversations:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      const conversations = result.conversations || [];
      
      console.log(`[ConversationsService] Found ${conversations.length} conversations for participant ${phoneNumber}`);
      
      return {
        success: true,
        data: conversations,
      };
    } catch (error) {
      console.error('[ConversationsService] Error getting conversations by participant:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getConversationsByParticipantAndProxy(phoneNumber: string, proxyAddress: string) {
    try {
      const accountSid = this.manager.serviceConfiguration.account_sid;
      const authToken = this.manager.serviceConfiguration.attributes.auth_token;
      
      // First get all conversations for this participant
      const participantConversations = await this.getConversationsByParticipant(phoneNumber);
      
      if (!participantConversations.success) {
        return participantConversations;
      }
      
      // Filter conversations that have the specific proxy address
      const conversationsWithProxy = [];
      
      for (const conversation of participantConversations.data) {
        try {
          // Get participants for this conversation to check proxy addresses
          const participantsResponse = await fetch(`${this.baseUrl}/Conversations/${conversation.conversation_sid}/Participants`, {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
            },
          });
          
          if (participantsResponse.ok) {
            const participantsResult = await participantsResponse.json();
            const participants = participantsResult.participants || [];
            
            // Check if any participant has the specific proxy address
            const hasProxy = participants.some((participant: any) => 
              participant.messaging_binding && 
              participant.messaging_binding.proxy_address === proxyAddress
            );
            
            if (hasProxy) {
              conversationsWithProxy.push(conversation);
            }
          }
        } catch (error) {
          console.warn(`[ConversationsService] Error checking participants for conversation ${conversation.conversation_sid}:`, error);
        }
      }
      
      console.log(`[ConversationsService] Found ${conversationsWithProxy.length} conversations for participant ${phoneNumber} with proxy ${proxyAddress}`);
      
      return {
        success: true,
        data: conversationsWithProxy,
      };
    } catch (error) {
      console.error('[ConversationsService] Error getting conversations by participant and proxy:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async closeConversation(conversationSid: string) {
    try {
      const accountSid = this.manager.serviceConfiguration.account_sid;
      const authToken = this.manager.serviceConfiguration.attributes.auth_token;
      
      const requestBody = new URLSearchParams();
      requestBody.append('State', 'closed');
      
      const response = await fetch(`${this.baseUrl}/Conversations/${conversationSid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        },
        body: requestBody.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[ConversationsService] Error closing conversation:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('[ConversationsService] Error closing conversation:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }



  async addStudioFlowWebhook(conversationSid: string, flowSid: string) {
    try {
      const accountSid = this.manager.serviceConfiguration.account_sid;
      const authToken = this.manager.serviceConfiguration.attributes.auth_token;
      
      const requestBody = new URLSearchParams();
      requestBody.append('Target', 'studio');
      requestBody.append('Configuration.FlowSid', flowSid);
      
      const response = await fetch(`${this.baseUrl}/Conversations/${conversationSid}/Webhooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        },
        body: requestBody.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('[ConversationsService] Error adding Studio Flow webhook:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }


} 