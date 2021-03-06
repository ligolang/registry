import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';

import { DetailContext } from '../../pages/Version';

export interface ViewerTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const ViewerTitle = (props: ViewerTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other} data-testid="raw-viewver-dialog">
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

/* eslint-disable verdaccio/jsx-spread */
const RawViewer: React.FC<Props> = ({ isOpen = false, onClose }) => {
  const detailContext = React.useContext(DetailContext);
  const { t } = useTranslation();

  const { packageMeta } = detailContext;
  return (
    <Dialog
      data-testid={'rawViewer--dialog'}
      id="raw-viewer--dialog-container"
      fullScreen={true}
      open={isOpen}
    >
      <ViewerTitle id="viewer-title" onClose={onClose}>
        {t('action-bar-action.raw')}
      </ViewerTitle>
      <DialogContent>
        <ReactJson
          src={packageMeta as any}
          collapsed={true}
          collapseStringsAfterLength={40}
          groupArraysAfterLength={10}
          enableClipboard={false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RawViewer;
