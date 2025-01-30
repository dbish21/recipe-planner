import React from 'react';
import { Snackbar, Alert, AlertProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '& .MuiAlert-icon': {
    fontSize: '1.5rem',
  },
}));

interface ToastProps extends Omit<AlertProps, 'children'> {
  open: boolean;
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  open,
  message,
  onClose,
  severity = 'success',
  ...props
}) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <StyledAlert onClose={onClose} severity={severity} {...props}>
      {message}
    </StyledAlert>
  </Snackbar>
);

export default Toast;