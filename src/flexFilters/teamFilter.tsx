import { filter } from '../helpers/flexFilters/filter';
import { FilterDefinition } from '@twilio/flex-ui';
import { FiltersListItemType } from "@twilio/flex-ui";

export const getTeamFilter = async (): Promise<FilterDefinition> => {
  const { teams, defaultSelect } = await filter.getTeamList();

  return {
    id: 'data.attributes.team',
    fieldName: 'team',
    type: FiltersListItemType.multiValue,
    title: 'Equipe',
    options: teams.map(team => ({
      value: team.name,
      label: team.name,
      default: defaultSelect,
    })),
    condition: 'IN',
  };
}