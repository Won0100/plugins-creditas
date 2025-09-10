import { addListener } from '../helpers/events/addListener';

export const handleEvents = () => {    
    addListener.reservationCreated();
    addListener.pluginsLoaded();
    addListener.workerActivityUpdated();
    addListener.messageAdded();
    addListener.userLoggedIn();
}