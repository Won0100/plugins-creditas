import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export type MainNavigationType = {
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>, //<Icon />    
    label: string, //Agentes
    slug: string //agent-desktop
}

export type ConfigNavigationType = {
    label: string, //Agentes
    slug: string //config/theme
}