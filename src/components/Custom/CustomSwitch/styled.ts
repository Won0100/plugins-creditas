import { styled } from '@mui/material/styles';

type ContainerProps = {
  checked: boolean;
  value: boolean;
}

export const Container = styled('div')<ContainerProps>(({ theme, checked }) => ({
  display: 'flex',
  alignItems: 'center',  
  width: '38px',
  height: '20px',
  borderRadius: '15px',  
  cursor: 'pointer',
  position: 'relative',
  backgroundColor: checked ? 'rgb(20, 176, 83)' : 'rgb(96, 107, 133)',
  '.thumb': {
    width: '20px',
    transition: 'all ease .3s',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgb(13, 19, 28)' : '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',  
    position: 'relative',
    left: !checked ? '0px' : '18px',    
    'svg': {
      fontSize: '18px',
      color: '#fff'
    }
  }
}));