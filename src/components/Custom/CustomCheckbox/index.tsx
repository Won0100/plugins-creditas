import * as MUI from '@mui/material';
import { ChangeEvent, Dispatch } from 'react';
import { LabelValueType } from '../../../types/common';

type Props = {   
    title: string; 
    value: string[];
    setValue: Dispatch<string[]>;
    options: LabelValueType[];
    disabled?: boolean;
    width?: string;
    height?: string;
    id?: string;
}

export const CustomCheckbox = ({ id, title, width, options, value, setValue, disabled, height }: Props) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setValue([...value, e.target.value]);
        } else {
            setValue(value.filter((cor) => cor !== e.target.value));
        }
    }

    return (
        <MUI.FormControl>
            <MUI.FormHelperText>{title}</MUI.FormHelperText>
            <MUI.FormControl variant="filled" sx={{             
                width: width || '30ch',
                marginBottom: '10px',
                height: height || '150px',
                overflow: 'auto'
            }}>                            
                {options.map((option => (
                    <MUI.FormControlLabel
                        key={option.value}
                        control={
                            <MUI.Checkbox 
                                id={id}
                                checked={value?.includes(option.value)} 
                                onChange={handleChange}
                                disabled={disabled}
                                value={option.value}
                            />
                        } 
                        label={option.label}                     
                    />                                   
                )))}
            </MUI.FormControl>  
        </MUI.FormControl>
    )
}