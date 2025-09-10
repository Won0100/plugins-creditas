import { RecordGlobal } from '../types/record';

export const object = {
    getNestedProperty: (obj: unknown, path: string) => {        
        if (typeof obj !== 'object' || obj === null) return undefined;    
        
        return path.split('.').reduce<RecordGlobal | undefined>((acc, part) => {
            if (acc && typeof acc === 'object') {
                return acc[part] as RecordGlobal | undefined;
            } else {
                return undefined;
            }
        }, obj as RecordGlobal | undefined);
    }
}