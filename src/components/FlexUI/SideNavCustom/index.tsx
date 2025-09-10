import { SideNavChildrenProps } from "@twilio/flex-ui"
import * as MUI from '@mui/material';
import { mainNavigation } from '../../../helpers/navigation/mainNavigation';
import { useTheme } from "@emotion/react";
import { invokeAction } from "../../../actions/invoke";
import { useEffect, useState } from "react";
import { localStorage } from '../../../helpers/localStorage/actions';
import { userInstance } from 'services/manager/user';
import { activityPanelList } from 'services/sync/activityPanel';
import { LocalStorageItemType } from '../../../helpers/localStorage/LocalStorageItemType';

export const SideNavCustom = ({ activeView }: SideNavChildrenProps) => {   
    const theme = useTheme() as MUI.Theme;     

    const [navigation, setNavigation] = useState(mainNavigation);

    // dynamic view
    useEffect(() => {
        if(!activeView?.startsWith('dialer')) return;
        
        setNavigation(prevNavigation =>                 
            prevNavigation.map(nav => 
                nav.label === 'Campanhas' 
                ? { ...nav, slug: localStorage.get(LocalStorageItemType.ATHAN_DIALER_LOCATION) as string } 
                : nav
            )                
        );
    }, [activeView]);

    return(        
        <MUI.Box sx={{ width: 250 }} role="presentation">
            <MUI.List key={activeView}>
                {navigation.map(nav => {
                    const active = nav.slug.includes(activeView || '');                    

                    return (
                        <MUI.ListItem key={nav.slug} disablePadding>   
                            <MUI.ListItemButton
                                onClick={async () => await invokeAction.navigateToView(nav.slug)}
                                style={{ 
                                    background: active 
                                    ? theme.palette.primary.main 
                                    : theme.palette.secondary.main                                
                                }}                            
                            >
                                <MUI.ListItemIcon>                           
                                        <nav.Icon 
                                            color={active ? "secondary" : "primary"} 
                                        />   
                                </MUI.ListItemIcon>
                                <MUI.ListItemText 
                                    primary={nav.label}                              
                                    sx={{ 
                                        color: active 
                                        ? theme.palette.secondary.main 
                                        : theme.palette.primary.main 
                                    }}                      
                                />
                            </MUI.ListItemButton>
                        </MUI.ListItem>
                    )
                })}
            </MUI.List>
        </MUI.Box>        
    )
}