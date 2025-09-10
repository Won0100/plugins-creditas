import * as MUI from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';
import { MouseEventHandler } from 'react';
import { OverridableStringUnion } from '@mui/types';

type Props = {
    value: string;
    margin?: string;
    align?: string;
    width?: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    onClick?: MouseEventHandler<HTMLButtonElement>
    disabled?: boolean;
    loading?: boolean;
    color?: OverridableStringUnion<
        'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
        MUI.ButtonPropsColorOverrides
    >;    
}

export const CustomButton = ({ width, value, margin, Icon, onClick, align, disabled, color, loading }: Props) => {
    return (
        <MUI.Box sx={{ 
            textAlign: align ?? '',             
            width: width || '100%' 
        }}>
            <MUI.Button variant="contained" 
                startIcon={<Icon />}
                sx={{ 
                    margin,
                    position: 'relative'
                }}
                onClick={onClick}
                disabled={disabled}
                color={color}                        
            >
                {value}
                {loading && (
                    <MUI.CircularProgress
                        size={24}
                        sx={{                
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
            </MUI.Button>            
        </MUI.Box>     
    )
}