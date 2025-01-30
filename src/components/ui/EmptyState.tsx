import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  minHeight: 200,
  textAlign: 'center',
}));

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  icon,
}) => (
  <EmptyStateContainer>
    {icon && <Box sx={{ mb: 2, color: 'primary.main' }}>{icon}</Box>}
    <Typography variant="h6">{title}</Typography>
    <Typography color="text.secondary">{message}</Typography>
    {actionLabel && onAction && (
      <Button variant="outlined" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </EmptyStateContainer>
);

export default EmptyState;
