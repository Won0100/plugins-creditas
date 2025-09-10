import React from 'react';
import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';

interface WhatsappToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const WhatsappToggleButton: React.FC<WhatsappToggleButtonProps> = ({ isOpen, onToggle }) => {
  return (
    <MUI.IconButton
      color="primary"
      onClick={onToggle}
      sx={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
      }}
    >
      <MUIIcon.IosShare sx={{ fontSize: 18 }} />
    </MUI.IconButton>
  );
}; 