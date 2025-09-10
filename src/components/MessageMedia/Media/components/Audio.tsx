import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';

import { AudioPlayerWrapper } from './styles';

export const Audio = ({ mediaUrl, mediaType }: any) => {
  return (
    <AudioPlayerWrapper>
      <audio controls>
        <source src={mediaUrl} type={mediaType} />
      </audio>
      <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>
        <DownloadIcon />
      </a>
    </AudioPlayerWrapper>
  );
}
