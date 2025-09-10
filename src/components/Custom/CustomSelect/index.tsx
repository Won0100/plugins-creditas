import * as MUI from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import { Dispatch } from "react";
import { LabelValueType } from "../../../types/common";

type Props = {
  label?: string;
  placeholder?: string;
  value: string | undefined;
  setValue: Dispatch<string>;
  Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  disabled?: boolean;
  width?: string;
  height?: string;
  margin?: string;
  options: LabelValueType[];
  required?: boolean;
  id?: string;
  disableMarginBottom?: boolean;
};

export const CustomSelect = ({
  id,
  required,
  width,
  height,
  margin,
  Icon,
  label,
  placeholder,
  value,
  disabled,
  options,
  setValue,
  disableMarginBottom = false,
}: Props) => {
  return (
    <MUI.FormControl
      sx={{
        margin: margin || "0",
        width: width || "30ch",
        marginBottom: disableMarginBottom ? "0px" : "10px",
        ".MuiInputBase-formControl": {
          height: height,
        },
      }}
      id={id}
    >
      <MUI.InputLabel id="label">{label}</MUI.InputLabel>
      <MUI.Select
        labelId="label"
        label={label}
        value={value}
        required={required}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        startAdornment={
          <MUI.InputAdornment position="start">
            {Icon && <Icon />}
          </MUI.InputAdornment>
        }
      >
        <MUI.MenuItem disabled value="">
          Selecione uma opção
        </MUI.MenuItem>
        {options.map((option, index) => (
          <MUI.MenuItem key={index + option.value} value={option.value}>
            {option.label}
          </MUI.MenuItem>
        ))}
      </MUI.Select>
    </MUI.FormControl>
  );
};
