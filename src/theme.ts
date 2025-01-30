import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f5f5f5',
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
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
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
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 30px -6px rgb(0 0 0 / 0.1), 0 10px 12px -7px rgb(0 0 0 / 0.1)',
    '0 30px 35px -7px rgb(0 0 0 / 0.1), 0 12px 14px -8px rgb(0 0 0 / 0.1)',
    '0 35px 40px -8px rgb(0 0 0 / 0.1), 0 14px 16px -9px rgb(0 0 0 / 0.1)',
    '0 40px 45px -9px rgb(0 0 0 / 0.1), 0 16px 18px -10px rgb(0 0 0 / 0.1)',
    '0 45px 50px -10px rgb(0 0 0 / 0.1), 0 18px 20px -11px rgb(0 0 0 / 0.1)',
    '0 50px 55px -11px rgb(0 0 0 / 0.1), 0 20px 22px -12px rgb(0 0 0 / 0.1)',
    '0 55px 60px -12px rgb(0 0 0 / 0.1), 0 22px 24px -13px rgb(0 0 0 / 0.1)',
    '0 60px 65px -13px rgb(0 0 0 / 0.1), 0 24px 26px -14px rgb(0 0 0 / 0.1)',
    '0 65px 70px -14px rgb(0 0 0 / 0.1), 0 26px 28px -15px rgb(0 0 0 / 0.1)',
    '0 70px 75px -15px rgb(0 0 0 / 0.1), 0 28px 30px -16px rgb(0 0 0 / 0.1)',
    '0 75px 80px -16px rgb(0 0 0 / 0.1), 0 30px 32px -17px rgb(0 0 0 / 0.1)',
    '0 80px 85px -17px rgb(0 0 0 / 0.1), 0 32px 34px -18px rgb(0 0 0 / 0.1)',
    '0 85px 90px -18px rgb(0 0 0 / 0.1), 0 34px 36px -19px rgb(0 0 0 / 0.1)',
    '0 90px 95px -19px rgb(0 0 0 / 0.1), 0 36px 38px -20px rgb(0 0 0 / 0.1)',
    '0 95px 100px -20px rgb(0 0 0 / 0.1), 0 38px 40px -21px rgb(0 0 0 / 0.1)',
    '0 100px 105px -21px rgb(0 0 0 / 0.1), 0 40px 42px -22px rgb(0 0 0 / 0.1)',
    '0 105px 110px -22px rgb(0 0 0 / 0.1), 0 42px 44px -23px rgb(0 0 0 / 0.1)',
    '0 110px 115px -23px rgb(0 0 0 / 0.1), 0 44px 46px -24px rgb(0 0 0 / 0.1)',
    '0 115px 120px -24px rgb(0 0 0 / 0.1), 0 46px 48px -25px rgb(0 0 0 / 0.1)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
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