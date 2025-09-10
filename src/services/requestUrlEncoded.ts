import { Manager } from '@twilio/flex-ui';
import { RecordGlobal, RecordString } from '../types/record';

export const requestUrlEncoded = async (method: string, url: string, params?: RecordString, data?: RecordGlobal): Promise<any> => {    
    try {
        let body: BodyInit | null = null;

        const manager = Manager.getInstance();

        switch(method.toUpperCase()) {
            case 'GET':
                let queryString = new URLSearchParams(params);
                url += `?${queryString}`;            
                break;
            case 'POST':
            case 'PUT':
            case 'DELETE':
                body = new URLSearchParams(data);
                break;
        }

        let req = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(`${manager.serviceConfiguration.account_sid}:${manager.serviceConfiguration.attributes.auth_token}`)
            },
            body
        });        

        if(!req.ok) {
            console.error(`Error: ${req.status} ${req.statusText}`);
            return;
        }

        return req.json();
    } catch(err) {
        if(err instanceof Error)
        console.error('request: ', err.message);
    }
}