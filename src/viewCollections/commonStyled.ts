import * as MUI from '@mui/material';

export const SimpleTitle = MUI.styled(MUI.Typography)(() => ({
    marginBottom: '15px',
    fontWeight: 'bold'
}));

export const SimpleBox = MUI.styled(MUI.Box)(() => ({
    margin: '20px 0'
}));

export const NoData = MUI.styled(MUI.Typography)(() => ({
    textAlign: 'center',
    marginTop: '40px'
}));