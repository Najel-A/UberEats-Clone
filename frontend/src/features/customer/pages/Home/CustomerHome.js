import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../../redux/slices/authSlice';

const CustomerHome = () => {
  const navigate = useNavigate();
  const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { user, token } = authState;


  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}
      >
        {/* Safe rendering with fallback */}
        <Typography variant="h4" component="h1">
          Welcome, {user || 'Valued Customer'}!
        </Typography>
        
        <Typography variant="body1">
          {token ? "Browse our menu" : "Please login to continue"}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default CustomerHome;