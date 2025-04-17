import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantMenu, clearMenu } from '../../../../redux/slices/restaurantSlice';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  Paper,
  Button,
  Badge,
  IconButton,
  CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../../../redux/slices/cartSlice';
import Cart from '../../components/Cart/Cart';
import { AddShoppingCart, Add } from '@mui/icons-material';

const MenuPage = () => {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { menu, loading, error } = useSelector(state => state.restaurants);
  const { items: cartItems } = useSelector(state => state.cart);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchRestaurantMenu(restaurantId));
    
    return () => {
      dispatch(clearMenu());
    };
  }, [restaurantId, dispatch]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddToCart = (menuItem) => {
    dispatch(addToCart({
      dishId: menuItem._id || menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      restaurantId: restaurantId
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Button 
            variant="outlined" 
            onClick={handleBack}
          >
            Back to Restaurants
          </Button>

          <IconButton 
            color="primary" 
            onClick={() => setCartOpen(true)}
            sx={{ position: 'relative' }}
          >
            <Badge 
              badgeContent={cartItems.length} 
              color="error"
              overlap="circular"
            >
              <AddShoppingCart fontSize="large" />
            </Badge>
          </IconButton>
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Typography color="error" variant="body1" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Menu Items
          </Typography>
          
          {menu && menu.length > 0 ? (
            <List>
              {menu.map((item) => (
                <ListItem 
                  key={item._id || item.id} 
                  divider
                  sx={{ display: 'flex', gap: 2 }}
                  secondaryAction={
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => handleAddToCart(item)}
                    >
                      Add
                    </Button>
                  }
                >
                  {item.image && (
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                      image={`http://localhost:5000${item.image}`}
                      alt={item.name}
                    />
                  )}
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" display="block">
                            {item.category}
                        </Typography>
                        {item.description && (
                          <Typography component="span" variant="body2" display="block">
                            {item.description}
                          </Typography>
                        )}
                        <Typography component="span" variant="body2" display="block">
                            {item.ingredients}
                          </Typography>
                        <Typography component="span" variant="body2" display="block">
                          Price: ${item.price?.toFixed(2) || 'N/A'}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            !loading && (
              <Typography variant="body1">
                {error ? 'Failed to load menu' : 'No menu items available'}
              </Typography>
            )
          )}
        </Paper>
      </Box>

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </Container>
  );
};

export default MenuPage;