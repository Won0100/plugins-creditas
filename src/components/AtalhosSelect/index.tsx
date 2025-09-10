import * as MUI from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from "@twilio/flex-ui";
import { atalhosDocument, FormData } from "../../services/sync/atalhos";
import { IconButton, Menu, MenuItem } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import { SelectWrapper } from "./styled";

import { teamsDocument } from "../../services/sync/teams";

type AtalhosSelectProps = {
  key: string;
  value: string;
  setValue: (value: string) => void;
  width?: string;
  height?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  workerProps: any;
}

export const AtalhosSelect = ({
  key,
  value,
  setValue,
  label = "Selecione um atalho",
  disabled = false,
  workerProps
}: AtalhosSelectProps) => {
  const [atalhos, setAtalhos] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const atalhosData = await atalhosDocument.get();
        const workerDepartmentId = workerProps?.department_id || null;
  
        if (!workerDepartmentId) {
          setAtalhos([]);
          setLoading(false);
          return;
        }
  
        const filteredAtalhos = atalhosData.filter(atalho => {
          if (!atalho.departments || atalho.departments.length === 0) return true;
          
          return atalho.departments.some(department => workerDepartmentId.includes(department));
        });
  
        setAtalhos(filteredAtalhos);
      } catch (error) {
        console.error("Erro ao carregar atalhos:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTemplates();
  }, [workerProps]);

  const options = atalhos.map((atalho) => ({
    label: atalho.name,
    value: atalho.content || "",
  }));

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (optionValue: string) => {
    setValue(optionValue);
    if (optionValue) {
      setOpenSnackbar(true);
    }
    handleClose();
  };

  return (
    <>
      <SelectWrapper>
        <IconButton
          onClick={handleClick}
          disabled={disabled}
          color="primary"
          title={label}
        >
          <AssignmentIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {options.map((option, index) => (
            <MenuItem
              key={index}
              onClick={() => handleMenuItemClick(option.value)}
              title={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </SelectWrapper>

      <MUI.Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        message="Atalho copiado!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};