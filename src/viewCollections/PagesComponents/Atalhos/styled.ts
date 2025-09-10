import { styled } from '@mui/material/styles';
import * as MUI from "@mui/material";

export const Section = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  padding: '1.5rem',
  background: '#111111',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
}));

export const PreviewContainer = styled(MUI.Paper)(({ theme }) => ({
  padding: '1.5rem',
  height: '100%',
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[2]
}));

export const PreviewContent = styled('div')(({ theme }) => ({
  marginTop: '1rem',
  padding: '1.5rem',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  minHeight: '200px',
  whiteSpace: 'pre-wrap',
  transition: 'all 0.3s ease'
}));

export const PreviewImage = styled('img')(() => ({
  height: '400px',
  width: '100%',
  objectFit: 'contain',
  borderRadius: '8px'
}));

export const PreviewText = styled('div')(() => ({
  position: 'absolute',
  maxWidth: '300px',
  marginTop: '80px',
  padding: '1rem',
  fontSize: '0.875rem',
  color: '#000',
  textAlign: 'left',
  wordWrap: 'break-word',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '6px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
}));

export const FormContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
  flexWrap: 'wrap'
}));

export const ButtonContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px'
}));