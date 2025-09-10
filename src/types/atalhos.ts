import { ReactNode } from 'react';

export type TemplateTypeOption = 'twilio/text' | 'twilio/media' | 'twilio/location' | 'twilio/list-picker' | 'twilio/call-to-action' | 'twilio/quick-reply' | 'twilio/card' | 'twilio/carousel' | 'twilio/catalog' | 'twilio/flows' | 'whatsapp/authentication' | 'whatsapp/card';

export type TemplateType = {
    sid: string;
    name: string;
    departments: string[];
}


export type AtalhoFormData = {
    id?: string;
    name: string;
    departments: string[];
    content: string;
    action?: 'update' | 'create' | 'delete' | null;
    createdAt?: string;
    updatedAt?: string;
  }