import * as MUI from "@mui/material";
import { CustomInput } from "../../../components/Custom/CustomInput";
import { CustomMultiSelect } from "../../../components/Custom/CustomMultiSelect";
import { CustomFilter } from "../../../components/Custom/CustomFilter";

type FilterProps = {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  departmentsFilter: string[];
  setDepartmentsFilter: (value: string[]) => void;
  onFilter: () => void;
  departments: any[];
}

export const AtalhoFilter = ({ 
  nameFilter,
  setNameFilter,
  departmentsFilter, 
  setDepartmentsFilter,
  onFilter,
  departments
}: FilterProps) => {

  return (
    <CustomFilter onFilter={onFilter}>
      <MUI.Grid container spacing={2}>
        <MUI.Grid item xs={12} md={6}>
          <CustomInput
            type="text"
            label="Nome do Atalho"
            placeholder="Buscar por nome"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            width="100%"
          />
        </MUI.Grid>
        <MUI.Grid item xs={12} md={6}>
          <CustomMultiSelect
            label="Áreas"
            placeholder="Filtrar por áreas"
            value={departmentsFilter}
            setValue={setDepartmentsFilter}
            options={departments}
            width="100%"
          />
        </MUI.Grid>
      </MUI.Grid>
    </CustomFilter>
  );
}; 