import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2C3E50',      // Navy blue from the gradient
      light: '#3498DB',     // Sky blue from the gradient
      dark: '#1a252f',      // Darker navy
      contrastText: '#fff',
    },
    secondary: {
      main: '#E74C3C',      // Coral red from the button
      light: '#F75C4C',     // Lighter coral
      dark: '#C0392B',      // Darker coral
      contrastText: '#fff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#2C3E50',   // Navy blue for text
      secondary: '#5D6D7E',  // Softer navy for secondary text
    },
    error: {
      main: '#E74C3C',      // Coral red
    },
    warning: {
      main: '#F39C12',      // Orange
    },
    info: {
      main: '#3498DB',      // Sky blue
    },
    success: {
      main: '#27AE60',      // Green
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      color: '#2C3E50',
    },
    h2: {
      fontWeight: 700,
      color: '#2C3E50',
    },
    h3: {
      fontWeight: 700,
      color: '#2C3E50',
    },
    h4: {
      fontWeight: 600,
      color: '#2C3E50',
    },
    h5: {
      fontWeight: 600,
      color: '#2C3E50',
    },
    h6: {
      fontWeight: 600,
      color: '#2C3E50',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease-in-out',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C3E50',
          boxShadow: 'none',
        },
      },
    },
  },
});