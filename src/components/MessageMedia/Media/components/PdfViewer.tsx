import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { PdfViewerWrapper } from './styles';

export const PdfViewer = ({ mediaUrl }: any) => {
  return (
    <PdfViewerWrapper>
      <iframe title='PDF Preview' src={mediaUrl} width='100%' />
      <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>
        <VisibilityIcon />
      </a>
    </PdfViewerWrapper>
  );
}
