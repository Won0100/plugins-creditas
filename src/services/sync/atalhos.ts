import { requestUrlEncoded } from '../requestUrlEncoded';
import { ServiceSyncType } from '../../types/sync';
import { Manager } from '@twilio/flex-ui';
import { v4 as uuidv4 } from 'uuid';

const manager = Manager.getInstance();
const defaultNameSyncDocument = `atalhos-${manager.serviceConfiguration.account_sid}`;
const url = `https://sync.twilio.com/v1/Services/${manager.serviceConfiguration.attributes?.sync_service_sid || process.env.FLEX_APP_SYNC_SERVICE_SID}/Documents`;

export type FormData = {
    id?: string;
    name: string;
    departments: string[];
    content: string;
    action?: 'update' | 'create' | 'delete' | null;
    createdAt?: string;
    updatedAt?: string;
}

interface DocumentAtalhoType extends ServiceSyncType {
    data: {
        [key: string]: Omit<FormData, 'id'>;
    };
}

type DocumentsAtalhoType = {
    documents: DocumentAtalhoType[]
}

export const atalhosDocument = {
    get: async () => {
        try {
            const response = await requestUrlEncoded('get', `${url}/${defaultNameSyncDocument}`);

            if (response?.data) {
                const document = response.data;
                if (document) {
                    return Object.entries(document).map(([id, data]) => ({
                        id,
                        ...(data as object)
                    })) as FormData[];
                } else {
                    await requestUrlEncoded('post', url, {}, {
                        UniqueName: defaultNameSyncDocument,
                        Data: JSON.stringify({})
                    });
                    return [];
                }
            }
            return [];
        } catch (err) {
            console.error('atalhosDocument.get: ', err instanceof Error ? err.message : err);
            return [];
        }
    },

    update: async (payload: FormData) => {
        try {
            if (!payload.id) {
                return {
                    success: false,
                    message: 'ID é obrigatório para atualização'
                };
            }

            const document = await atalhosDocument.get();
            const currentData = Array.isArray(document) ? document : [];
            
            const nameExists = currentData.some(item => item.name === payload.name && item.id !== payload.id);
            
            if (nameExists) {
                return {
                    success: false,
                    message: 'Já existe um template com este nome'
                };
            }

            const documentObj = currentData.reduce((acc: any, item: any) => ({
                ...acc,
                [item.id]: {
                    name: item.name,
                    departments: item.departments,
                    content: item.content,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }
            }), {});

            
            const { id, action, ...dataWithoutIdAndAction } = payload;
            documentObj[id] = {
                ...dataWithoutIdAndAction,
                updatedAt: new Date().toISOString(),
                createdAt: documentObj[id].createdAt
            };

            const response = await requestUrlEncoded('post',`${url}/${defaultNameSyncDocument}`, {}, {
                Data: JSON.stringify(documentObj)
            });

            return response?.sid ? {
                success: true,
                message: 'Template atualizado com sucesso',
                data: { id, ...documentObj[id] }
            } : {
                success: false,
                message: 'Erro ao atualizar template'
            };
        } catch (err) {
            console.error('atalhosDocument.update: ', err instanceof Error ? err.message : err);
            return {
                success: false,
                message: 'Erro ao atualizar template'
            };
        }
    },

    create: async (payload: FormData) => {
        try {
            const document = await atalhosDocument.get();
            const currentData = Array.isArray(document) ? document : [];
            
            const nameExists = currentData.some(item => item.name === payload.name);
            
            if (nameExists) {
                return {
                    success: false,
                    message: 'Já existe um template com este nome'
                };
            }

            const documentObj = currentData.reduce((acc: any, item: any) => ({
                ...acc,
                [item.id]: {
                    name: item.name,
                    departments: item.departments,
                    content: item.content,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }
            }), {});

            
            const newId = uuidv4();
            const now = new Date().toISOString();
            const { id, action, ...dataWithoutActionAndId } = payload;
            documentObj[newId] = {
                ...dataWithoutActionAndId,
                createdAt: now,
                updatedAt: now
            };

            const response = await requestUrlEncoded('post',`${url}/${defaultNameSyncDocument}`, {}, {
                Data: JSON.stringify(documentObj)
            });

            return response?.sid ? {
                success: true,
                message: 'Template criado com sucesso'
            } : {
                success: false,
                message: 'Erro ao criar template'
            };
        } catch (err) {
            console.error('atalhosDocument.create: ', err instanceof Error ? err.message : err);
            return {
                success: false,
                message: 'Erro ao criar template'
            };
        }
    },

    delete: async (id: string) => {
        try {
            const document = await atalhosDocument.get();
            const currentData = Array.isArray(document) ? document : [];
            const documentObj = currentData.reduce((acc: any, item: any) => ({
                ...acc,
                [item.id]: item
            }), {});

            if (!documentObj[id]) {
                throw new Error('Template não encontrado');
            }

            delete documentObj[id];

            const response = await requestUrlEncoded('post',`${url}/${defaultNameSyncDocument}`, {}, {
                Data: JSON.stringify(documentObj)
            });

            return response?.sid ? {
                success: true,
                message: 'Template deletado com sucesso'
            } : {
                success: false,
                message: 'Erro ao deletar template'
            };
        } catch (err) {
            console.error('atalhosDocument.delete: ', err instanceof Error ? err.message : err);
            return {
                success: false,
                message: 'Erro ao deletar template'
            };
        }
    }
}