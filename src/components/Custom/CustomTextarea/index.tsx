import * as MUI from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ChangeEvent } from "react";

type Props = {
  label: string;
  placeholder: string;
  value: string | undefined;
  setValue?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  Icon?: OverridableComponent<MUI.SvgIconTypeMap<{}, "svg">>;
  disabled?: boolean;
  width?: string;
  rows?: number;
  required?: boolean;
};

export const CustomTextarea = ({
  Icon,
  width,
  label,
  placeholder,
  value,
  disabled,
  setValue,
  required,
  rows,
}: Props) => {
  return (
    <MUI.FormControl
      sx={{
        width: width || "30ch",
        marginBottom: "10px",
      }}
    >
      <MUI.TextField
        label={label}
        variant="outlined"
        placeholder={placeholder}
        value={value || ""}
        onChange={setValue}
        disabled={disabled}
        multiline
        required={required}
        rows={rows || 5}
        maxRows={10}
        InputProps={{
          startAdornment: (
            <MUI.InputAdornment position="start">
              {Icon && <Icon />}
            </MUI.InputAdornment>
          ),
        }}
      />
    </MUI.FormControl>
  );
};
