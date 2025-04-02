import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../../../redux/slices/cartSlice';
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
  Grid
} from '@mui/material';
import { ArrowBack, CreditCard, LocalShipping } from '@mui/icons-material';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = React.useState({
    name: user || '',
    address: '',
    phone: '',
    paymentMethod: 'credit',
    specialInstructions: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the order to your backend
    console.log('Order submitted:', { 
      ...formData, 
      items, 
      total,
      status: 'pending'
    });
    
    dispatch(clearCart());
    navigate('/order-confirmation');
  };

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

      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <List>
              {items.map((item, index) => (
                <React.Fragment key={item.dishId}>
                  <ListItem>
                    <ListItemText
                      primary={`${item.name} (x${item.quantity})`}
                      secondary={`$${(item.price * item.quantity).toFixed(2)}`}
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
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
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
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                disabled={items.length === 0}
              >
                Place Order
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;