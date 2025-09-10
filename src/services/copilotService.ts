import { Manager } from '@twilio/flex-ui';

interface CopilotResponse {
    aiResponse: string;
    agentName: string;
    isError?: boolean;
}

interface FeedbackRequest {
    Guid: string;
    AgentName: string;
    InputMessage: string;
    EditedInputMessage: string;
    UserMessage: string;
    FeedbackMessageType: number;
    Telephone: string;
    UserId: string;
    Email: string;
}

class CopilotService {
    private static instance: CopilotService;

    private constructor() {}


    public static getInstance(): CopilotService {
        if (!CopilotService.instance) {
            CopilotService.instance = new CopilotService();
        }
        return CopilotService.instance;
    }

    private getToken(): string {
        const manager = Manager.getInstance();
        return manager.user.token;
    }

    public async getAIResponse(message: string, phoneNumber: string, task: any): Promise<CopilotResponse> {
        try {
            const token = this.getToken();
            const manager = Manager.getInstance();
            const currentUser = manager.workerClient?.friendlyName || manager.user.identity;
            const currentUserEmail = manager.workerClient?.attributes?.email;

            let guid = "";
            let endpoint = "";
            if(manager.serviceConfiguration.account_sid == process.env.REACT_APP_TWILIO_ACCOUNT_SID){
                endpoint = "https://stg-api.creditas.io/insurance-twilio-border/whatsapp/copilot/messages";
                guid = "8032904d-50b9-4fe9-b438-83b1dd87f220";
            }else{
                endpoint = "https://api.creditas.io/insurance-twilio-border/whatsapp/copilot/messages";
                guid = task.attributes.solicitacaoId;
            }
            
            // Check if solicitacaoId is null and return early with specific message
            if (!guid || guid === null || guid === undefined) {
                return {
                    aiResponse: "[SEM LINK DO OGM]",
                    agentName: currentUser
                };
            }
            
            // Store GUID in task attributes if it doesn't exist
            if (!task?.attributes?.conversations?.guid) {
                await task.setAttributes({
                    ...task.attributes,
                    conversations: {
                        ...task.attributes.conversations,
                        guid
                    }
                });
            }
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-twilio-flex-authorization': token
                },
                body: JSON.stringify({
                    Guid: guid,
                    InputMessage: message,
                    Telephone: phoneNumber,
                    UserId: currentUser,
                    Email: currentUserEmail
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data: CopilotResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting AI response:', error);
            throw error;
        }
    }

    public async sendFeedback(feedback: FeedbackRequest, task: any): Promise<void> {
        try {
            const token = this.getToken();
            const manager = Manager.getInstance();
            let guid = "";
            let endpoint = "";
            if(manager.serviceConfiguration.account_sid == process.env.REACT_APP_TWILIO_ACCOUNT_SID){
                endpoint = "https://stg-api.creditas.io/insurance-twilio-border/whatsapp/copilot/feedbacks";
                guid = "8032904d-50b9-4fe9-b438-83b1dd87f220";
            }else{
                endpoint = "https://api.creditas.io/insurance-twilio-border/whatsapp/copilot/feedbacks";
                guid = task.attributes.solicitacaoId;
            }
            
            // Map camelCase keys to PascalCase for API
            const feedbackPayload = {
                Guid: guid,
                AgentName: (feedback as any).AgentName,
                InputMessage: feedback.InputMessage,
                EditedInputMessage: feedback.EditedInputMessage,
                UserMessage: feedback.UserMessage,
                FeedbackMessageType: feedback.FeedbackMessageType,
                Telephone: feedback.Telephone,
                UserId: feedback.UserId,
                Email: feedback.Email
            };
            
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-twilio-flex-authorization': token
                },
                body: JSON.stringify(feedbackPayload)
            });

            if (!response.ok) {
                throw new Error('Failed to send feedback');
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
            throw error;
        }
    }
}

export const copilotService = CopilotService.getInstance(); 