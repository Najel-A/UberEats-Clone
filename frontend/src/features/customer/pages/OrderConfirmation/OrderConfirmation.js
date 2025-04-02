import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
      <Typography variant="h3" gutterBottom>
        Order Confirmed!
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Thank you for your order. Your food is being prepared.
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        We'll send you a confirmation email with your order details.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/customer/home')}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default OrderConfirmation;