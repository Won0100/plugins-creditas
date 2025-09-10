import React from 'react';
import { Icon } from '@twilio/flex-ui';

import { NotSupportedMedia } from './styles';

export const Unsupported = () => {
  return (
    <>
      <NotSupportedMedia>
        Formato de mídia não suportado
        <div className="helpIcon">
          <Icon icon="Help" />
        </div>
      </NotSupportedMedia>
      <em>
        {'Mídias suportadas:\n\n.png\n.jpeg\n.mpeg\n.ogg\n.amr\n.pdf\n.mp4'}
      </em>
    </>
  );
}
