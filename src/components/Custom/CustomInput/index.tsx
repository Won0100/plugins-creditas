import * as MUI from "@mui/material";
import { SvgIconTypeMap, TextFieldProps } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ChangeEvent } from "react";

interface Props extends Omit<TextFieldProps, "variant"> {
  label?: string;
  placeholder?: string;
  value?: string | number | null | undefined;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type: string;
  Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  disabled?: boolean;
  width?: string;
  height?: string;
  required?: boolean;
  textAlign?:
    | "start"
    | "end"
    | "left"
    | "right"
    | "center"
    | "justify"
    | "match-parent";
  marginBottom?: string;
}

export const CustomInput = ({
  marginBottom,
  textAlign,
  required,
  width,
  label,
  placeholder,
  value,
  onChange,
  Icon,
  disabled,
  type,
  height,
  ...props
}: Props) => {
  return (
    <MUI.FormControl
      variant="filled"
      sx={{
        width: width || "30ch",
        marginBottom: marginBottom || "10px",
        ".MuiInputBase-formControl": {
          height: height,
        },
        input: { textAlign },
      }}
    >
      <MUI.TextField
        label={label}
        variant="outlined"
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...(Icon && {
          InputProps: {
            startAdornment: (
              <MUI.InputAdornment position="start">
                {Icon && <Icon />}
              </MUI.InputAdornment>
            ),
          },
        })}
        {...props}
      />
    </MUI.FormControl>
  );
};
