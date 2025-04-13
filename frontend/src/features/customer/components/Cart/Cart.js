import React from 'react';
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
} from '@mui/material';
import { Delete, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeItem, updateQuantity, clearCart } from '../../../../redux/slices/cartSlice';

const Cart = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector(state => state.cart);
  console.log('Cart items:', items);

  const handleQuantityChange = (dishId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      dispatch(updateQuantity({ dishId, quantity }));
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
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
        
        {items.length === 0 ? (
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
                <React.Fragment key={item.dishId}>
                  <ListItem 
                    sx={{ 
                      py: 2,
                      '&:hover': { 
                        backgroundColor: 'action.hover' 
                      }
                    }}
                  >
                    <Avatar
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      variant="rounded"
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <ListItemText
                      primary={
                        <Typography fontWeight="medium">
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          ${item.price.toFixed(2)} each
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(item.dishId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.dishId, e.target.value)}
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
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(item.dishId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Add fontSize="small" />
                      </IconButton>
                      <IconButton 
                        onClick={() => dispatch(removeItem(item.dishId))}
                        color="error"
                        aria-label="Remove item"
                        sx={{ ml: 1 }}
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
                  onClick={() => dispatch(clearCart())}
                  startIcon={<Delete />}
                >
                  Clear All
                </Button>
                <Button 
                  fullWidth
                  variant="contained" 
                  color="primary"
                  onClick={handleCheckout}
                  disabled={items.length === 0}
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