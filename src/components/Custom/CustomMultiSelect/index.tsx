import * as MUI from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import { Dispatch } from "react";
import { LabelValueType } from "../../../types/common";
import { Theme, useTheme } from "@mui/material/styles";

type Props = {
  label: string;
  placeholder: string;
  value: string[];
  setValue: Dispatch<string[]>;
  Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  disabled?: boolean;
  width?: string;
  height?: string;
  margin?: string;
  options: LabelValueType[];
  required?: boolean;
  id?: string;
  allowDelete?: boolean;
};

export const CustomMultiSelect = ({
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
  allowDelete,
}: Props) => {
  const theme = useTheme();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const getStyles = (name: string | undefined, personName: string[], theme: Theme) => {
    return {
      fontWeight:
        personName.indexOf(name || '') === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

  const handleChange = (event: MUI.SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setValue(typeof value === "string" ? value.split(",") : value);
  };

  const handleDelete = (valueDelete: string) => {
    const newState = [...value];

    const deleteItem = newState.filter((item) => item !== valueDelete);

    setValue(deleteItem);
  };

  return (
    <MUI.FormControl
      sx={{
        margin: margin || "0",
        width: width || "30ch",
        marginBottom: "10px",
        ".MuiInputBase-formControl": {
          height: height,
        },
        // ".MuiChip-deletable": {
        //   position: 'relative',
        //   zIndex: 1000
        // }
      }}
      id={id}
    >
      <MUI.InputLabel id="demo-multiple-chip-label">{label}</MUI.InputLabel>
      <MUI.Select
        labelId="demo-simple-select-label"
        multiple
        value={value}
        placeholder={placeholder}
        label={label}
        required={required}
        onChange={handleChange}
        disabled={disabled}
        startAdornment={
          <MUI.InputAdornment position="start">
            {Icon && <Icon />}
          </MUI.InputAdornment>
        }
        input={<MUI.OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected: string[]) => (
          <MUI.Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <span
                key={value}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <MUI.Chip
                  key={value}
                  label={value}
                  {...(allowDelete && {
                    onDelete: () => handleDelete(value),
                  })}
                />
              </span>
            ))}
          </MUI.Box>
        )}
        MenuProps={MenuProps}
      >
        {options.map((option) => (
          <MUI.MenuItem
            key={option.value || option.id}
            value={option.value || option.id}
            style={getStyles(option.value || option.id, value, theme)}
          >
            {option.label}
          </MUI.MenuItem>
        ))}
      </MUI.Select>
    </MUI.FormControl>
  );
};
