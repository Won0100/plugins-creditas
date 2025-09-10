import { filter } from '../helpers/flexFilters/filter';
import { FilterDefinition } from '@twilio/flex-ui';
import { FiltersListItemType } from "@twilio/flex-ui";

const { teams, defaultSelect } = filter.getSkillList();

export const skillFilter: FilterDefinition = {
  id: 'data.attributes.routing.skills',
  fieldName: 'Habilidades',
  type: FiltersListItemType.multiValue,
  title: 'Habilidades',
  options: teams.map(skill => ({
    value: skill.name,
    label: skill.name,
    default: defaultSelect,
  })),
  condition: 'IN',
}