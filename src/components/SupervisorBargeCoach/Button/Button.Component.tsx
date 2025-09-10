import * as React from 'react';
import { IconButton, CircularProgress, ButtonThemeProps } from '@twilio/flex-ui';

import { ButtonContainer } from './Button.Style';

interface ButtonProps {
  icon: React.ReactNode
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  themeOverride?: ButtonThemeProps
  title?: string
  style?: React.CSSProperties
  loading?: boolean
}

const Button = ({ icon, disabled, onClick, themeOverride, title, style, loading }: ButtonProps) => {
  if (loading) {
    disabled = true;
  }

  const btn = (
    /*@ts-ignore para ignorar os erros pela falta das propriedades onPointerEnterCapture, onPointerLeaveCapture, placeholder que não existem nesse IconButton*/
    <IconButton
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      themeOverride={themeOverride}
      title={title}
      style={style}
    />
  );

  if (loading) {
    return (
      <ButtonContainer>
        <CircularProgress animating size={44} override={{ marginBottom: '-44px' }} />
        {btn}
      </ButtonContainer>
    );
  }

  return <ButtonContainer>{btn}</ButtonContainer>;
};

export default Button;
