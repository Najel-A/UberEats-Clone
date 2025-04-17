import React, { useEffect } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Button,
  TextField,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { Delete, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchCart,
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  resetCartError
} from '../../../../redux/slices/cartSlice';

const Cart = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    items, 
    restaurantId, 
    loading, 
    error 
  } = useSelector(state => state.cart);
  const { token } = useSelector(state => state.auth);

  // Calculate total based on items
  const total = items.reduce((sum, item) => {
    return sum + (item.dish.price * item.quantity);
  }, 0);

  // Fetch cart when drawer opens
  useEffect(() => {
    if (open && token) {
      dispatch(fetchCart());
    }
  }, [open, token, dispatch]);

  const handleQuantityChange = async (dishId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      try {
        await dispatch(updateCartItem({ dishId, quantity })).unwrap();
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const handleRemoveItem = async (dishId) => {
    try {
      await dispatch(removeFromCart(dishId)).unwrap();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleCloseError = () => {
    dispatch(resetCartError());
  };

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } }
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingCart color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            Your Order
          </Typography>
        </Box>
        
        {/* Error Notification */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {loading ? (
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Your cart is empty
            </Typography>
            <Button 
              variant="outlined" 
              onClick={onClose}
            >
              Browse Menu
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
              {items.map((item) => (
                <React.Fragment key={item.dish._id}>
                  <ListItem 
                    sx={{ 
                      py: 2,
                      '&:hover': { 
                        backgroundColor: 'action.hover' 
                      }
                    }}
                  >
                    <Avatar
                      src={`http://localhost:5000${item.dish.profilePicture}`}
                      alt={item.dish.name}
                      variant="rounded"
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <ListItemText
                      primary={
                        <Typography fontWeight="medium">
                          {item.dish.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            ${item.dish.price} each
                          </Typography>
                          {item.special_instructions && (
                            <Typography variant="caption" color="text.secondary">
                              Note: {item.special_instructions}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(item.dish._id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        disabled={loading}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.dish._id, e.target.value)}
                        sx={{ 
                          width: 60, 
                          mx: 1,
                          '& .MuiInputBase-input': { 
                            textAlign: 'center',
                            py: 0.5
                          }
                        }}
                        inputProps={{ 
                          'aria-label': 'Quantity',
                          min: 1,
                          type: 'number'
                        }}
                        disabled={loading}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(item.dish._id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        disabled={loading}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleRemoveItem(item.dish._id)}
                        color="error"
                        aria-label="Remove item"
                        sx={{ ml: 1 }}
                        disabled={loading}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 2
              }}>
                <Typography variant="subtitle1">Subtotal:</Typography>
                <Typography variant="subtitle1">${total.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  fullWidth
                  variant="outlined" 
                  color="error" 
                  onClick={handleClearCart}
                  startIcon={<Delete />}
                  disabled={loading || items.length === 0}
                >
                  Clear All
                </Button>
                <Button 
                  fullWidth
                  variant="contained" 
                  color="primary"
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                >
                  Checkout
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Cart;