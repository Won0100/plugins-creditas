import { Actions } from '@twilio/flex-ui'

export const handleAfterLogout = () => {
    Actions.addListener('afterLogout', async (payload) => {
        try {
            localStorage.removeItem('teamViewPath');
            localStorage.removeItem('agentSyncDoc');
            localStorage.removeItem('privateToggle');
        } catch (err) {
            console.error("afterLogout", err);
        }
    });
}