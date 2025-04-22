import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../../../redux/slices/cartSlice';
import { submitOrder, resetOrderState } from '../../../../redux/slices/orderSlice';
import {
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { ArrowBack, CreditCard, LocalShipping } from '@mui/icons-material';
import './Checkout.css';

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
    }
  };

  // Loading state
  if (orderStatus === 'loading' || cartLoading) {
    return (
      <div className="loading-container">
        <CircularProgress className="loading-spinner" size={60} />
        <Typography className="loading-text">
          {cartLoading ? 'Loading your cart...' : 'Processing your order...'}
        </Typography>
      </div>
    );
  }

  // Success state (before redirect)
  if (orderStatus === 'succeeded') {
    return (
      <div className="success-container">
        <Alert severity="success" className="success-alert">
          Order placed successfully! Redirecting to confirmation page...
        </Alert>
        <CircularProgress className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <Button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowBack /> Back to Cart
      </Button>

      <Typography className="checkout-title">
        Checkout
      </Typography>

      {orderError && (
        <Alert severity="error" className="error-alert">
          {orderError}
        </Alert>
      )}

      <div className="checkout-grid">
        {/* Order Summary */}
        <div className="order-summary-card">
          <Typography className="card-title">
            Order Summary
          </Typography>
          
          <div className="order-items-list">
            {items.map((item) => (
              <div key={item.dish._id} className="order-item">
                <Avatar 
                  className="item-avatar"
                  src={`http://localhost:5000${item.dish.profilePicture}`}
                  alt={item.dish.name}
                  variant="rounded"
                />
                <div className="item-content">
                  <Typography className="item-name">
                    {item.dish.name} (x{item.quantity})
                  </Typography>
                  <Typography className="item-price">
                    ${item.dish.price.toFixed(2)} each
                  </Typography>
                  {item.special_instructions && (
                    <Typography className="item-note">
                      Note: {item.special_instructions}
                    </Typography>
                  )}
                </div>
                <Typography className="item-total">
                  ${(item.dish.price * item.quantity).toFixed(2)}
                </Typography>
              </div>
            ))}
          </div>

          <hr className="order-divider" />

          <div className="total-container">
            <Typography className="total-label">Total:</Typography>
            <Typography className="total-amount">${total.toFixed(2)}</Typography>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="checkout-form-card">
          <Typography className="card-title">
            Delivery Information
          </Typography>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-field">
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={user?.name || ''}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>

            <div className="form-field">
              <TextField
                fullWidth
                label="Delivery Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                multiline
                rows={3}
                helperText="Please enter your complete delivery address"
              />
            </div>

            <div className="form-field">
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                inputProps={{
                  pattern: "[0-9]{10}",
                }}
                helperText="Please enter a valid 10-digit phone number"
              />
            </div>

            <div className="form-field">
              <Typography variant="subtitle1" gutterBottom>
                Payment Method
              </Typography>
              <div className="payment-methods">
                <div 
                  className={`payment-method ${formData.paymentMethod === 'credit' ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, paymentMethod: 'credit'})}
                >
                  <CreditCard className="payment-icon" />
                  <Typography>Credit Card</Typography>
                </div>
                <div 
                  className={`payment-method ${formData.paymentMethod === 'cash' ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, paymentMethod: 'cash'})}
                >
                  <LocalShipping className="payment-icon" />
                  <Typography>Cash on Delivery</Typography>
                </div>
              </div>
            </div>

            <div className="form-field">
              <TextField
                fullWidth
                label="Special Instructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                multiline
                rows={3}
                helperText="Any special instructions for your order (optional)"
              />
            </div>

            <Button
              type="submit"
              className="submit-button"
              disabled={orderStatus === 'loading'}
            >
              {orderStatus === 'loading' ? 'Processing...' : 'Place Order'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;