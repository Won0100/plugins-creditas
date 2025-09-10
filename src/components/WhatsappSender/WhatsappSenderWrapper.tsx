import React, { useState } from 'react';
import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Manager } from '@twilio/flex-ui';
import { WhatsappSender } from './WhatsappSenderComponent';
import { WhatsappToggleButton } from './WhatsappToggleButton';

export const WhatsappSenderWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Get the Twilio Flex theme background color
  const getTwilioBackgroundColor = () => {
    const manager = Manager.getInstance();
    const flexTheme = manager.configuration.theme as any;
    return flexTheme?.colors?.companySecondaryColor || 'background.paper';
  };

  return (
    <>
      <WhatsappToggleButton isOpen={isOpen} onToggle={handleToggle} />
      
      <MUI.Box
        sx={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-400px',
          width: '400px',
          height: '100vh',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgb(18, 28, 45)' : '#ffffff',
          borderLeft: '1px solid',
          borderColor: 'divider',
          boxShadow: isOpen ? 3 : 0,
          transition: 'right 0.3s ease-in-out',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <MUI.Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText'
          }}
        >
          <MUI.Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MUIIcon.WhatsApp />
            Enviar WhatsApp
          </MUI.Typography>
          <MUI.IconButton onClick={handleToggle} color="inherit">
            <MUIIcon.Close />
          </MUI.IconButton>
        </MUI.Box>
        
        <MUI.Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <WhatsappSender isOpen={isOpen} onToggle={handleToggle} />
        </MUI.Box>
      </MUI.Box>
    </>
  );
}; 