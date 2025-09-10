import { CustomizeTaskInfoType } from '../../types/customizeTaskInfo';

export const defaultData: CustomizeTaskInfoType = {
    infoCustomer: [],
    infoTask: [
        { 
            label: 'Task SID', 
            value: 'task.taskSid', 
            id: '093750f8-9739-477d-aa90-bbf40218615d' 
        },
        { 
            label: 'Canal', 
            value: 'task.channelType', 
            id: 'ad17117d-952e-4a0f-abf9-8991aa0838c6' 
        },
        { 
            label: 'Criação', 
            value: 'task.dateCreated', 
            id: '325f207a-6258-471f-9f91-962d23105857' 
        },
        { 
            label: 'Fila', 
            value: 'task.queueName', 
            id: 'd1a5338f-6818-45dd-b8d7-152752c8682c' 
        },
        { 
            label: 'Direção', 
            value: 'task.attributes.direction', 
            id: 'd1a5338f-6818-45dd-b8d7-152752c0325c' 
        }
    ]
};