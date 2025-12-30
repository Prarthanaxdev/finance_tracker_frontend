import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f1724', // page background
      paper: '#0f2230', // card background
    },
    primary: {
      main: '#12C48B', // green accent
      contrastText: '#ffffff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9aa4b2',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
