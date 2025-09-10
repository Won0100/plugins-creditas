import { Manager, ServiceConfiguration } from '@twilio/flex-ui';
import { requestAppJson } from './requestAppJson';
import { whatsappSendersDocument } from './sync/whatsappSenders';

const manager = Manager.getInstance();
const ACCOUNT_SID = manager.serviceConfiguration.account_sid;

interface ContentTemplate {
  sid: string;
  name: string;
  teams?: string[];
  variables?: { [key: string]: string };
}

interface ContentResponse {
  contents: ContentTemplate[];
}

// serviço que pega os content templates
export const serviceContent = {
    get: async (): Promise<ContentResponse> => {
        try {
            const response = await requestAppJson(
                'get',
                'https://content.twilio.com/v1/Content',
                { PageSize: '1000' },
                {},
                true
            );
            
            return response as ContentResponse;
        } catch (err) {
            if (err instanceof Error)
            console.error("serviceContent.get: ", err.message);
            return { contents: [] };
        }
    },
    create: async (payload: {
        friendly_name: string;
        language: string;
        variables: {
            [key: string]: string;
        };
        types: {
            [key: string]: {
                body: string;
            };
        };
    }) => {
        try {
            const response = await requestAppJson(
                'post',
                'https://content.twilio.com/v1/Content',
                {},
                payload,
                true
            );
            
            return response;
        } catch (err) {
            if (err instanceof Error)
                console.error("serviceContent.create: ", err.message);
            return null;
        }
    },
    checkEligibility: async (url: string) => {
        try {
            const response = await requestAppJson(
                'get',
                url,
                {},
                {},
                true
            );
            return response
        } catch (err) {
            if (err instanceof Error)
                console.error("serviceContent.create: ", err.message);
            return null;
        }
    },
    sendContentTemplate: async(payload: {
        content_sid: string;
        to: string;
        from: string;
        messaging_service_sid?: string;
        variables: {
            [key: string]: string;
        }
    }) => {
        try {
            const formData = new URLSearchParams();
            formData.append('ContentSid', payload.content_sid);
            formData.append('To', `whatsapp:${payload.to}`);
            formData.append('From', `whatsapp:${payload.from}`);
            
            // Add MessagingServiceSid if provided
            if (payload.messaging_service_sid) {
                formData.append('MessagingServiceSid', payload.messaging_service_sid);
            }
            
            // Only add ContentVariables if there are variables to send
            if (Object.keys(payload.variables).length > 0) {
                const contentVariables = JSON.stringify(payload.variables);
                formData.append('ContentVariables', contentVariables);
                console.log('Sending ContentVariables:', contentVariables);
            }

            console.log('Sending WhatsApp template message:', {
                ContentSid: payload.content_sid,
                To: `whatsapp:${payload.to}`,
                From: `whatsapp:${payload.from}`,
                ContentVariables: Object.keys(payload.variables).length > 0 ? JSON.stringify(payload.variables) : 'none'
            });

            const response = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${btoa(`${ACCOUNT_SID}:${manager.serviceConfiguration.attributes.auth_token}`)}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Twilio API Error:', response.status, errorText);
                return { status: response.status, error: errorText };
            }

            const data = await response.json();
            console.log('Twilio API Response:', data);
            return data;
        } catch (err) {
            if (err instanceof Error)
                console.error("serviceContent.sendContentTemplate: ", err.message);
            return null;
        }
    },
    getSenders: async () => {
        try {
            const response = await whatsappSendersDocument.get();
            
            if (response && response.data && response.data.numbers) {
                // Transform the numbers array into the expected format
                const senders = response.data.numbers.map((number, index) => ({
                    sid: `sender_${index}`,
                    address: number,
                    friendly_name: number,
                    type: 'whatsapp'
                }));
                
                return { addresses: senders };
            } else {
                console.log('No WhatsApp senders found in Sync document');
                return { addresses: [] };
            }
        } catch (err) {
            if (err instanceof Error)
                console.error("serviceContent.getSenders: ", err.message);
            return { addresses: [] };
        }
    },
    // Get template details including variables
    getTemplateDetails: async (contentSid: string) => {
        try {
            const response = await requestAppJson(
                'get',
                `https://content.twilio.com/v1/Content/${contentSid}`,
                {},
                {},
                true
            );
            return response;
        } catch (err) {
            if (err instanceof Error)
                console.error("serviceContent.getTemplateDetails: ", err.message);
            return null;
        }
    }
}