import { styled } from '@twilio/flex-ui';

export const ImageWrapper = styled('div')`
  padding-left: 10px;
  padding-bottom: 10px;
`;

export const AudioPlayerWrapper = styled('div')`
  padding: 5px;

  audio {
    width: 100%;
  }
`;

export const PdfViewerWrapper = styled('div')`
  padding: 5px;
`;

export const VideoPlayerWrapper = styled('div')`
  padding: 5px;
`;

export const NotSupportedMedia = styled('div')`
  font-style: italic;
  padding-left: 10px;
  padding-bottom: 8px;
  opacity: 70%;
  display: flex;
  align-items: center;
  .helpIcon {
    display: inline-flex;
    padding: 3px;
  }
`;
