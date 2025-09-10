import { TableDepartments } from "components/Tables/TableDepartments";
import { DepartmentItemType } from "types/department";
import { Tabs } from "types/tabs";

type Props = {
  departments: DepartmentItemType[];
  tabs: Tabs[];
  loading: boolean;
  edit: boolean;
  changeItem: (
    id: string,
    key: keyof DepartmentItemType,
    value: string | string[]
  ) => void;
  deleteItem: (id: string) => void;
};

export const Departments = ({
  departments,
  tabs,
  loading,
  edit,
  changeItem,
  deleteItem,
}: Props) => {
  return (
    <TableDepartments
      data={departments}
      tabs={tabs}
      loading={loading}
      edit={edit}
      changeItem={changeItem}
      deleteItem={deleteItem}
    />
  );
};
