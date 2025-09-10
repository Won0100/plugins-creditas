import React from 'react';
import { ImageWrapper } from './styles';
import { Actions } from '@twilio/flex-ui';

export const Image = ({ mediaUrl }: any) => {
  return (
    <ImageWrapper>
      <img
        src={mediaUrl}
        alt='MMS'
        width='150px'
        onClick={() =>
          Actions.invokeAction('smsModalControl', {
            url: mediaUrl
          })
        }
      />
    </ImageWrapper>
  );
}
