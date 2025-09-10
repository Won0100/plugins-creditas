import { styled } from '@mui/material/styles';

type ContainerProps = {
  checked: boolean;
  value: boolean;
}

export const Container = styled('div')<ContainerProps>(({ theme, checked }) => ({
  display: 'flex',
  alignItems: 'center',  
  width: '45px',
  height: '20px',
  borderRadius: '15px',
  backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',  
  cursor: 'pointer',
  position: 'relative',
  marginTop: '7px',
  '.thumb': {
    width: '27px',
    transition: 'all ease .3s',
    height: '27px',
    borderRadius: '50%',
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
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