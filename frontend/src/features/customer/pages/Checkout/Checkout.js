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
  CircularProgress,
  Avatar,
  ListItemAvatar
} from '@mui/material';
import { ArrowBack, CreditCard, LocalShipping } from '@mui/icons-material';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { items, restaurantId, loading: cartLoading } = useSelector(state => state.cart);
  const { profile, user, id, token } = useSelector(state => state.auth);
  const { status: orderStatus, error: orderError, currentOrder } = useSelector(state => state.order);

  // Calculate total based on items
  const total = items.reduce((sum, item) => {
    return sum + (item.dish.price * item.quantity);
  }, 0);

  // Form state
  const [formData, setFormData] = useState({
    address: profile?.address || '',
    phone: profile?.phone || '',
    paymentMethod: 'credit',
    specialInstructions: ''
  });

  // Reset order state on component mount
  useEffect(() => {
    dispatch(resetOrderState());
    
    // If cart is empty, redirect back
    if (items.length === 0 && !cartLoading) {
      navigate('/order-confirmation');
    }
  }, [dispatch, items.length, cartLoading, navigate]);

  // Handle successful order submission
  useEffect(() => {
    if (orderStatus === 'succeeded' && currentOrder) {
      dispatch(clearCart());
      const timer = setTimeout(() => {
        navigate(`/order-confirmation/${currentOrder._id}`);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [orderStatus, currentOrder, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setLocalError(null);
  
    //if (!validateOrder()) return;
  
    try {
      // Prepare order items exactly as backend expects
      const orderItems = items.map(item => ({
        dish: item.dish._id,  // Just the ID string - backend will convert to ObjectId
        quantity: item.quantity,
        priceAtTime: item.dish.price // Using current price from dish
      }));
      console.log('OrderItems:', orderItems)
      // Structure matches your backend's expected request body
      const orderData = {
        items: orderItems,
        customer_id: id,    // As string - backend will convert
        restaurant_id: restaurantId, // As string - backend will convert
        total_price: total,
        // These will be added to order but not shown in your controller
        // delivery_address: formData.address,
        // phone_number: formData.phone,
        // payment_method: formData.paymentMethod,
        // special_instructions: formData.specialInstructions
      };
      console.log('Order Data:', orderData);
      console.log('Submitting order:', JSON.stringify(orderData, null, 2));
  
      dispatch(submitOrder({ 
        orderData, // This exact structure matches your backend
        token 
      }));
    } catch (error) {
      console.error('Order submission error:', error);
      //setLocalError('Failed to process order. Please try again.');
    }
  };

  // Loading state
  if (orderStatus === 'loading' || cartLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {cartLoading ? 'Loading your cart...' : 'Processing your order...'}
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
              {items.map((item) => (
                <React.Fragment key={item.dish._id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar 
                        src={`http://localhost:5000${item.dish.profilePicture}`}
                        alt={item.dish.name}
                        variant="rounded"
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${item.dish.name} (x${item.quantity})`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            ${item.dish.price.toFixed(2)} each
                          </Typography>
                          {item.special_instructions && (
                            <Typography component="div" variant="caption" color="text.secondary">
                              Note: {item.special_instructions}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <Typography variant="body1">
                      ${(item.dish.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                  <Divider />
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
                helperText="Please enter your complete delivery address"
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