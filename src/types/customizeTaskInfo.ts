import { LabelValueType } from './common';

export type InfoModeType = 'infoTask' | 'infoCustomer';

export type InfoFieldType = 'value' | 'label' | 'id';

export interface InfoType extends LabelValueType {
    id: string;
}

export type CustomizeTaskInfoType = {
    infoCustomer: InfoType[];
    infoTask: InfoType[];
}