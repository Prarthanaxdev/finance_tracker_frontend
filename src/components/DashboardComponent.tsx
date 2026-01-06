import { Box, Button, Typography, Alert } from '@mui/material';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import {logout} from '../reducers/authSlice';
import { useDispatch } from 'react-redux';

const DashboardComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(logout());
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <Box sx={{
      p: { xs: 1, md: 2 },
      backgroundColor: 'background.paper',
      minHeight: '85px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 1,
    }}>
      <Typography variant="h5" className="logo" sx={{ fontSize: { xs: '18px', md: 'h5' } }}>
        <SavingsOutlinedIcon fontSize="large" />
        FinanceFlow
      </Typography>
      <Button
        color="inherit"
        sx={{fontSize: { xs: '14px', md: '16px' }}}
        startIcon={<LogoutIcon />}
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default DashboardComponent;
