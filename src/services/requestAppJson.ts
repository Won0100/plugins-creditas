import { RecordGlobal, RecordString } from '../types/record';
import { localStorage } from '../helpers/localStorage/actions';
import { invokeAction } from '../actions/invoke';
import { LocalStorageItemType } from "../helpers/localStorage/LocalStorageItemType";
import { Manager } from '@twilio/flex-ui';

export const requestAppJson = async (method: string, url: string, params?: RecordString, data?: RecordGlobal, authTwilio?: boolean): Promise<unknown> => {    
    try {
        method = method.toUpperCase();
        let body: BodyInit | null = null;        
        let token = localStorage.get(LocalStorageItemType.ATHAN_USER_CRM_TOKEN) || '';

        if(authTwilio) {
            const manager = Manager.getInstance();
            const accountSid = manager.serviceConfiguration.account_sid;
            const authToken = manager.serviceConfiguration.attributes.auth_token;
            token = 'Basic ' + btoa(`${accountSid}:${authToken}`)
        }

        switch(method) {
            case 'GET':
                let queryString = new URLSearchParams(params);
                url += `?${queryString}`;            
                break;
            case 'POST':
            case 'PUT':
            case 'DELETE':
                body = JSON.stringify(data);
                break;
        }

        let req = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body
        });

        const reqJson = await req.json();

        if(reqJson?.message?.status === 401 && reqJson?.message?.message === 'Não autorizado!') {
            localStorage.removeAll();
            invokeAction.navigateToView('dialer-login');
            return;
        }        

        return reqJson;
    } catch(err) {
        if(err instanceof Error)
        console.error('request: ', err.message);
    }
}