/**
 * ConversationCleanupHandler
 * 
 * This handler automatically cleans up inactive conversations from localStorage
 * by checking their status via the Twilio Conversations API.
 * 
 * Features:
 * - Runs initial cleanup 5 seconds after initialization
 * - Runs periodic cleanup every 3 hours
 * - Checks conversation status via Twilio API
 * - Removes conversations that are no longer active/open
 * - Maintains both conversation data and mapping cleanup
 * 
 * Testing:
 * In development mode, you can test manually via browser console:
 * - conversationCleanupHandler.getConversationStats() - Get current counts
 * - conversationCleanupHandler.performCleanup() - Trigger manual cleanup
 * 
 * The handler replaces the old 48-hour time-based cleanup with API-based
 * verification to ensure only truly inactive conversations are removed.
 */

import { copilotStorage } from './localStorage/actions';
import { Manager } from '@twilio/flex-ui';

interface TaskConversation {
    messages: any[];
    isProcessing: boolean;
    conversationSid?: string;
    lastUpdated?: number;
    currentGrouping?: {
        timerStartedAt: number;
        groupId: string;
    };
    processingStartTime?: number;
}

interface ConversationTaskMapping {
    [reservationSid: string]: string; // Maps reservationSid to conversationSid
}

// Singleton for conversation cleanup
class ConversationCleanupHandler {
    private static instance: ConversationCleanupHandler;
    private cleanupInterval: NodeJS.Timeout | null = null;
    private readonly CLEANUP_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    private constructor() {
        console.log('[ConversationCleanup] Initializing conversation cleanup handler...');
        this.startCleanupInterval();
        // Run initial cleanup after a short delay
        setTimeout(() => {
            this.cleanupInactiveConversations();
        }, 5000); // 5 seconds delay
    }

    public static getInstance(): ConversationCleanupHandler {
        if (!ConversationCleanupHandler.instance) {
            console.log('[ConversationCleanup] Creating new instance...');
            ConversationCleanupHandler.instance = new ConversationCleanupHandler();
        }
        return ConversationCleanupHandler.instance;
    }

    private startCleanupInterval() {
        // Run cleanup every 3 hours
        this.cleanupInterval = setInterval(() => {
            this.cleanupInactiveConversations();
        }, this.CLEANUP_INTERVAL);
        console.log('[ConversationCleanup] Cleanup interval started - runs every 3 hours');
    }

    private async checkConversationExists(conversationSid: string): Promise<boolean> {
        try {
            const manager = Manager.getInstance();
            const accountSid = manager.serviceConfiguration.account_sid;
            const authToken = manager.serviceConfiguration.attributes?.auth_token;

            if (!authToken) {
                console.error('[ConversationCleanup] No auth token available');
                return true; // Assume conversation exists if we can't check
            }

            // Use Twilio Conversations API to check if conversation exists and is active
            const response = await fetch(
                `https://conversations.twilio.com/v1/Conversations/${conversationSid}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`
                    }
                }
            );

            if (response.status === 404) {
                console.log(`[ConversationCleanup] Conversation ${conversationSid} not found (404)`);
                return false;
            }

            if (!response.ok) {
                console.warn(`[ConversationCleanup] Error checking conversation ${conversationSid}: ${response.status} ${response.statusText}`);
                return true; // Assume conversation exists if we get an error (to be safe)
            }

            const conversationData = await response.json();
            const state = conversationData.state;
            
            // Consider conversation inactive if it's closed or inactive
            const isActive = state === 'active';
            console.log(`[ConversationCleanup] Conversation ${conversationSid} state: ${state}, active: ${isActive}`);
            
            return isActive;
        } catch (error) {
            console.error(`[ConversationCleanup] Error checking conversation ${conversationSid}:`, error);
            return true; // Assume conversation exists if we can't check (to be safe)
        }
    }

    private async cleanupInactiveConversations() {
        try {
            console.log('[ConversationCleanup] Starting conversation cleanup...');
            
            // Get all conversations from localStorage
            const conversations = copilotStorage.getConversations() as Record<string, TaskConversation>;
            const mapping = copilotStorage.getMapping() as ConversationTaskMapping;
            
            console.log(`[ConversationCleanup] Found ${Object.keys(conversations).length} conversations in storage`);
            console.log(`[ConversationCleanup] Found ${Object.keys(mapping).length} mappings in storage`);
            
            let conversationsToRemove: string[] = [];
            let mappingsToRemove: string[] = [];
            
            // Check each conversation
            for (const [reservationSid, conversation] of Object.entries(conversations)) {
                const conversationSid = conversation.conversationSid || mapping[reservationSid];
                
                if (!conversationSid) {
                    console.log(`[ConversationCleanup] No conversationSid found for reservation ${reservationSid}, marking for removal`);
                    conversationsToRemove.push(reservationSid);
                    continue;
                }
                
                console.log(`[ConversationCleanup] Checking conversation ${conversationSid} for reservation ${reservationSid}`);
                
                // Check if conversation is still active via Twilio API
                const isActive = await checkConversationExists(conversationSid);
                
                if (!isActive) {
                    console.log(`[ConversationCleanup] Conversation ${conversationSid} is not active, marking for removal`);
                    conversationsToRemove.push(reservationSid);
                    mappingsToRemove.push(reservationSid);
                } else {
                    console.log(`[ConversationCleanup] Conversation ${conversationSid} is still active, keeping it`);
                }
                
                // Add a small delay between API calls to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Remove inactive conversations and mappings
            if (conversationsToRemove.length > 0 || mappingsToRemove.length > 0) {
                const updatedConversations = { ...conversations };
                const updatedMapping = { ...mapping };
                
                conversationsToRemove.forEach(reservationSid => {
                    delete updatedConversations[reservationSid];
                });
                
                mappingsToRemove.forEach(reservationSid => {
                    delete updatedMapping[reservationSid];
                });
                
                // Save updated data back to localStorage
                copilotStorage.setConversations(updatedConversations);
                copilotStorage.setMapping(updatedMapping);
                
                console.log(`[ConversationCleanup] Removed ${conversationsToRemove.length} conversations and ${mappingsToRemove.length} mappings`);
                console.log(`[ConversationCleanup] Remaining: ${Object.keys(updatedConversations).length} conversations, ${Object.keys(updatedMapping).length} mappings`);
            } else {
                console.log('[ConversationCleanup] No inactive conversations found to remove');
            }
            
        } catch (error) {
            console.error('[ConversationCleanup] Error during conversation cleanup:', error);
        }
    }

    // Manual cleanup method that can be called externally
    public async performCleanup(): Promise<void> {
        console.log('[ConversationCleanup] Manual cleanup requested');
        await this.cleanupInactiveConversations();
    }

    // Debug method to get current conversation count
    public getConversationStats(): { conversationCount: number; mappingCount: number } {
        const conversations = copilotStorage.getConversations();
        const mapping = copilotStorage.getMapping();
        
        return {
            conversationCount: Object.keys(conversations).length,
            mappingCount: Object.keys(mapping).length
        };
    }

    // Add cleanup method to be called when component unmounts
    public cleanup() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
            console.log('[ConversationCleanup] Cleanup interval stopped');
        }
    }
}

// Helper function to check if conversation exists (can be used independently)
async function checkConversationExists(conversationSid: string): Promise<boolean> {
    try {
        const manager = Manager.getInstance();
        const accountSid = manager.serviceConfiguration.account_sid;
        const authToken = manager.serviceConfiguration.attributes?.auth_token;

        if (!authToken) {
            console.error('[ConversationCleanup] No auth token available');
            return true;
        }

        const response = await fetch(
            `https://conversations.twilio.com/v1/Conversations/${conversationSid}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`
                }
            }
        );

        if (response.status === 404) {
            return false;
        }

        if (!response.ok) {
            console.warn(`[ConversationCleanup] Error checking conversation ${conversationSid}: ${response.status}`);
            return true;
        }

        const conversationData = await response.json();
        return conversationData.state === 'active';
    } catch (error) {
        console.error(`[ConversationCleanup] Error checking conversation ${conversationSid}:`, error);
        return true;
    }
}

// Export singleton instance and helper function
export const conversationCleanupHandler = ConversationCleanupHandler.getInstance();
export { checkConversationExists };

// Add to global window for testing purposes (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).conversationCleanupHandler = conversationCleanupHandler;
}
