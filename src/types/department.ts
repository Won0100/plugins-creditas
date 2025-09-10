export type DepartmentItemType = {
  id: string;
  name: string;
  tabs: string[];
  activities: string[];
};

export type DepartmentType = {
  departments: DepartmentItemType[];
};
