import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';

import { VideoPlayerWrapper } from './styles';

export const Video = ({ mediaUrl, mediaType }) => {
  return (
    <VideoPlayerWrapper>
      <video width='100%' height="300px" controls key={mediaUrl}>
        <source src={mediaUrl} type={mediaType} />
      </video>
      <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>
        <DownloadIcon />
      </a>
    </VideoPlayerWrapper>
  );
}
