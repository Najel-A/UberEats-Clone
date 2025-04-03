import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../../../redux/slices/cartSlice';
import { submitOrder, resetOrderState } from '../../../../redux/slices/orderSlice';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Box,
  TextField,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack, CreditCard, LocalShipping } from '@mui/icons-material';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { items, total, restaurantId } = useSelector(state => state.cart);
  const { profile, user, id } = useSelector(state => state.auth);
  const { status: orderStatus, error: orderError, currentOrder } = useSelector(state => state.order);
//   console.log('Restaurant ID:', restaurantId);
//   console.log('User:', user?.id);
//   console.log('Profile:', id);

  // Form state
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    paymentMethod: 'credit',
    specialInstructions: ''
  });

  // Reset order state on component mount
  useEffect(() => {
    dispatch(resetOrderState());
  }, [dispatch]);

  // Handle successful order submission
  useEffect(() => {
    if (orderStatus === 'succeeded' && currentOrder) {
      dispatch(clearCart());
      const timer = setTimeout(() => {
        navigate(`/order-confirmation`);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [orderStatus, currentOrder, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!items.length || !restaurantId) return;

    const orderData = {
        items: items.map(item => ({
          dish: item.dishId,
          quantity: item.quantity,
          priceAtTime: item.price
        })),
        customer_id: id,
        restaurant_id: restaurantId,
        total_price: total,
        // deliveryAddress: formData.address,
        // phoneNumber: formData.phone,
        // paymentMethod: formData.paymentMethod,
        // specialInstructions: formData.specialInstructions
      };
      console.log(orderData);
      dispatch(submitOrder(orderData));
  };
  

  // Loading state
  if (orderStatus === 'loading') {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Processing your order...
        </Typography>
      </Container>
    );
  }

  // Success state (before redirect)
  if (orderStatus === 'succeeded') {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Order placed successfully! Redirecting to confirmation page...
        </Alert>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Cart
      </Button>

      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {orderError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {orderError}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <List>
              {items.map((item, index) => (
                <React.Fragment key={`${item.dishId}-${index}`}>
                  <ListItem>
                    <ListItemText
                      primary={`${item.name} (x${item.quantity})`}
                      secondary={`${(item.price * item.quantity).toFixed(2)}`}
                    />
                  </ListItem>
                  {index < items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Checkout Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Delivery Information
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={user?.name || ''}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                fullWidth
                label="Delivery Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                required
                multiline
                rows={3}
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{
                  pattern: "[0-9]{10}",
                  title: "Please enter a 10-digit phone number"
                }}
              />

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Payment Method
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant={formData.paymentMethod === 'credit' ? 'contained' : 'outlined'}
                  onClick={() => setFormData({...formData, paymentMethod: 'credit'})}
                  startIcon={<CreditCard />}
                >
                  Credit Card
                </Button>
                <Button
                  variant={formData.paymentMethod === 'cash' ? 'contained' : 'outlined'}
                  onClick={() => setFormData({...formData, paymentMethod: 'cash'})}
                  startIcon={<LocalShipping />}
                >
                  Cash on Delivery
                </Button>
              </Box>

              <TextField
                fullWidth
                label="Special Instructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={2}
                placeholder="e.g., Leave at front door, dietary restrictions, etc."
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                disabled={items.length === 0 || orderStatus === 'loading'}
              >
                {orderStatus === 'loading' ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;