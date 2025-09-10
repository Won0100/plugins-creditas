import React, { useCallback, useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";

export const ImageModal = () => {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState('');

  useEffect(() => {
    const handleModalOpen = (e: any) => {
      showForm(e.url);
    };

    document.addEventListener('smsModalControlOpen', handleModalOpen, false);

    return () => {
      document.removeEventListener('smsModalControlOpen', handleModalOpen);
    };
  }, []);

  const showForm = useCallback((media: any) => {
    setOpen(true);
    setMedia(media);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="form-dialog-title"
      maxWidth={'md'}
    >
      <img
        width="100%"
        src={media}
        alt="MMS Media"
        style={{
          objectFit: 'contain',
          height: 'calc(100vh - 96px)'
        }}
      />
    </Dialog>
  );
};
