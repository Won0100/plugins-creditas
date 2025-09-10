import React, { useMemo } from 'react';
import { Image } from './components/Image';
import { Audio } from './components/Audio';
import { PdfViewer } from './components/PdfViewer';
import { Video } from './components/Video';
import { Unsupported } from './components/Unsupported';

export const MediaMessageComponent = ({ mediaType, mediaUrl }: any) => {  
  const MediaComponent = useMemo(() => {
    if (mediaType.includes("twilio")) {
      return <></>;
    }

    switch (mediaType) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/webp':
        return <Image mediaUrl={mediaUrl} />;
      case 'audio/mpeg':
      case 'audio/ogg':
      case 'audio/amr':
        return <Audio mediaType={mediaType} mediaUrl={mediaUrl} />;
      case 'application/pdf':
        return <PdfViewer mediaUrl={mediaUrl} />;
      case 'video/mp4':
        return <Video mediaType={mediaType} mediaUrl={mediaUrl} />;
      default:
        return <Unsupported />;
    }
  }, [mediaType, mediaUrl]);

  return MediaComponent;
}
