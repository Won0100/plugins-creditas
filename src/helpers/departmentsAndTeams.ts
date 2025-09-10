import { TeamsItemType } from 'types/teams';
import { DepartmentItemType } from '../types/department';

export const departmentsAndTeams = {
    checkDepartmentSameNames: (payload: DepartmentItemType[], name: string) => {
        return payload.some(item => item.name.toLowerCase() === name.toLowerCase());
    },
    checkTeamsSameNames: (payload: TeamsItemType[], name: string) => {
        return payload.some(item => item.name.toLowerCase() === name.toLowerCase());
    }
}