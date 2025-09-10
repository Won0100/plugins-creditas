import * as MUI from '@mui/material';

type Props = {
    loading: boolean;
}

export const Backdrop = ({ loading }: Props) => {
    return (
        <MUI.Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}            
        >
        <MUI.CircularProgress color="inherit" />
      </MUI.Backdrop>
    )
}