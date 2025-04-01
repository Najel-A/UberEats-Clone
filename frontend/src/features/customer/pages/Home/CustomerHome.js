import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

const CustomerHome = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
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
        <Typography variant="h4" component="h1">
          Welcome, Guest!
        </Typography>
        
        <Typography variant="body1">
          What would you like to eat today?
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
