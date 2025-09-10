import { filter } from '../helpers/flexFilters/filter';
import { FilterDefinition } from '@twilio/flex-ui';
import { FiltersListItemType } from "@twilio/flex-ui";

const { activities, defaultSelect } = filter.getActivityList();

export const activityFilter: FilterDefinition = {
  id: 'data.activity_name',
  fieldName: 'Atividades',
  type: FiltersListItemType.multiValue,
  title: 'Atividades',
  options: activities.map(activity => ({
    value: activity.name,
    label: activity.name,
    default: defaultSelect,
  })),
  condition: 'IN',
}