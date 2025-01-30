import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(3),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

interface StyledDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const StyledDialog: React.FC<StyledDialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth={maxWidth}
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      },
    }}
  >
    <StyledDialogTitle>
      <Typography variant="h6">{title}</Typography>
      <IconButton onClick={onClose} size="small">
        <CloseIcon />
      </IconButton>
    </StyledDialogTitle>
    <StyledDialogContent>{children}</StyledDialogContent>
    {actions && <StyledDialogActions>{actions}</StyledDialogActions>}
  </Dialog>
);

export default StyledDialog;
