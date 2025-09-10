import { Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();

interface WhatsAppResponse {
  messageSid: string;
  from: string;
  to: string;
  body: string;
  timestamp: string;
  conversationSid?: string;
}

interface AgentMapping {
  agentId: string;
  agentName: string;
  agentEmail: string;
  phoneNumber: string;
  lastMessageTime: number;
}

export const whatsappResponseHandler = {
  // Store agent mappings for routing responses
  agentMappings: new Map<string, AgentMapping>(),

  // Register an agent's outgoing message
  registerOutgoingMessage: (agentId: string, agentName: string, agentEmail: string, phoneNumber: string) => {
    const mapping: AgentMapping = {
      agentId,
      agentName,
      agentEmail,
      phoneNumber,
      lastMessageTime: Date.now()
    };
    
    whatsappResponseHandler.agentMappings.set(phoneNumber, mapping);
    
    // Clean up old mappings (older than 24 hours)
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    for (const [key, value] of whatsappResponseHandler.agentMappings.entries()) {
      if (value.lastMessageTime < oneDayAgo) {
        whatsappResponseHandler.agentMappings.delete(key);
      }
    }
  },

  // Get the agent who should receive the response
  getAgentForResponse: (phoneNumber: string): AgentMapping | null => {
    return whatsappResponseHandler.agentMappings.get(phoneNumber) || null;
  },

  // Handle incoming WhatsApp response
  handleIncomingResponse: async (response: WhatsAppResponse) => {
    try {
      const phoneNumber = response.from.replace('whatsapp:', '');
      const agentMapping = whatsappResponseHandler.getAgentForResponse(phoneNumber);
      
      if (!agentMapping) {
        console.log(`No agent mapping found for phone number: ${phoneNumber}`);
        return null;
      }

      console.log(`Routing WhatsApp response to agent: ${agentMapping.agentName} (${agentMapping.agentEmail})`);
      
      // For now, just log the response and agent mapping
      // In a full implementation, this would create a conversation or task
      return {
        agentMapping,
        response,
        phoneNumber
      };
    } catch (error) {
      console.error('Error handling WhatsApp response:', error);
      return null;
    }
  },

  // Webhook handler for incoming WhatsApp messages
  handleWebhook: async (webhookData: any) => {
    try {
      const response: WhatsAppResponse = {
        messageSid: webhookData.MessageSid,
        from: webhookData.From,
        to: webhookData.To,
        body: webhookData.Body,
        timestamp: webhookData.Timestamp
      };

      return await whatsappResponseHandler.handleIncomingResponse(response);
    } catch (error) {
      console.error('Error handling webhook:', error);
      return null;
    }
  },

  // Get all current agent mappings (for debugging)
  getAllMappings: () => {
    const mappings: { [key: string]: AgentMapping } = {};
    for (const [key, value] of whatsappResponseHandler.agentMappings.entries()) {
      mappings[key] = value;
    }
    return mappings;
  },

  // Clear all mappings (for testing)
  clearMappings: () => {
    whatsappResponseHandler.agentMappings.clear();
  }
}; 