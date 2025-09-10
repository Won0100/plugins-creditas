import { filter } from '../helpers/flexFilters/filter';
import { FilterDefinition } from '@twilio/flex-ui';
import { FiltersListItemType } from "@twilio/flex-ui";

export const getAreaAgentFilter = async (): Promise<FilterDefinition> => {
  const { departments, defaultSelect } = await filter.getDepartmentList();

  return {
    id: 'data.attributes.area',
    fieldName: 'area',
    type: FiltersListItemType.multiValue,
    title: 'Área',
    options: departments.map(department => ({
      value: department.name,
      label: department.name,
      default: defaultSelect,
    })),
    condition: 'IN',
  };
}