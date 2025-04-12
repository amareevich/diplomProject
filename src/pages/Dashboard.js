import React from 'react';
import { Container, Box, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Calendar from '../components/Calendar';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  // localStorage.clear()
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true }); 
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ maxWidth: '1800px', margin: '0 auto' }}>
      <Box
        sx={{
          display: 'flex',
          height: '70vh',
        }}
      >
        <Box sx={{ width: '25%', borderRight: '1px solid #ddd' }}>
          <Sidebar />
          <Box sx={{ p: 2 }}>
            <Button variant="contained" onClick={handleLogout}>Выйти</Button>
          </Box>
        </Box>
        <Box sx={{ width: '75%' }}>
          <Calendar />
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;