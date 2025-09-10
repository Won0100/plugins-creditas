import * as MUI from '@mui/material';
import { DepartmentItemType } from '../../../../types/department';
import { TeamsItemType } from '../../../../types/teams';
import { TableTeams } from '../../../../components/Tables/TableTeams';
import { TaskRouterQueue } from '@twilio/flex-ui/src/core/FlexDataClient';

type Props = {
    departments: DepartmentItemType[]
    teams: TeamsItemType[];
    loading: boolean;
    edit: boolean;
    queues: TaskRouterQueue[];
    changeItem: (id: string, key: keyof TeamsItemType, value: string | string[]) => void;
    deleteItem: (id: string) => void;
}

export const Teams = ({ departments, teams, loading, edit, queues, changeItem, deleteItem }: Props) => {
    return (
        <TableTeams
            loading={loading}
            teams={teams}
            edit={edit}
            departments={departments}
            queues={queues}
            changeItem={changeItem}
            deleteItem={deleteItem}
        />
    )
}