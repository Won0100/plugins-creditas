import { styled, Paper, Box, SpeedDial, Typography } from '@mui/material';

export const ContainerCard = styled(Box)(() => ({
    padding: '30px',
    width: '100%',
    borderRadius: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
    overflow: 'auto'
}));

export const ContainerText = styled(Box)(() => ({
    display: 'flex',
    gap: '10px',
    margin: '20px 0'
}));

export const CampaignCard = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,    
    color: theme.palette.text.secondary,    
    width: '270px',
    padding: '25px'    
}));

export const BoxSpeedDial = styled(Box)(() => ({    
    transform: 'translateZ(0px)'    
}));

export const BoxSpeedDialItem = styled(SpeedDial)(() => ({    
    position: 'absolute', 
    bottom: 0, 
    right: 0,
    '.MuiFab-circular': {
        minHeight: '0',
        minWidth: '0',
        height: '40px',
        width: '40px'
    },
    '.MuiSpeedDial-actions': { padding: 0, margin: 0 }
}));

export const Title = styled(Typography)(({ theme }) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    fontSize: '1.1rem',
    color: theme.palette.primary.main,
}));