import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  Paper,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import { 
  ShoppingCart, 
  AccountCircle, 
  Favorite, 
  History, 
  ExitToApp 
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../../redux/slices/authSlice';
import { fetchRestaurants } from '../../../../redux/slices/restaurantSlice';
import { fetchCustomerProfile } from '../../../../redux/slices/customerSlice'; // Add this import
import Cart from '../../components/Cart/Cart';

const CustomerHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const { profile, loading: profileLoading } = useSelector(state => state.customer || {}); // Add safe access
  const { restaurants, loading: restaurantsLoading, error } = useSelector(state => state.restaurants);
  const { items } = useSelector(state => state.cart);
  
  // State for cart drawer
  const [cartOpen, setCartOpen] = useState(false);
  // State for profile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (token) {
      dispatch(fetchRestaurants());
      dispatch(fetchCustomerProfile()); // Fetch profile data on load
    }
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth="md">
      {/* Header with Cart and Profile buttons */}
      <Box sx={{ 
        position: 'fixed', 
        top: 16, 
        right: 16, 
        zIndex: 1200,
        display: 'flex',
        gap: 1
      }}>
        {/* Profile Button */}
        <IconButton
          onClick={handleProfileMenuOpen}
          color="primary"
          aria-label="profile"
          aria-controls="profile-menu"
          aria-haspopup="true"
          aria-expanded={profileMenuOpen ? 'true' : undefined}
        >
          <AccountCircle fontSize="large" />
        </IconButton>
        
        {/* Cart Button */}
        <IconButton onClick={toggleCart} color="primary" aria-label="cart">
          <Badge badgeContent={items.length} color="error">
            <ShoppingCart fontSize="large" />
          </Badge>
        </IconButton>
      </Box>
      
      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={profileMenuOpen}
        onClose={handleProfileMenuClose}
        MenuListProps={{
          'aria-labelledby': 'profile-button',
        }}
        PaperProps={{
          style: {
            width: 200,
          },
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar sx={{ width: 56, height: 56, margin: 'auto' }}>
            {user ? user.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            {profile?.name || user || 'User'} {/* Safe access to profile name */}
          </Typography>
        </Box>
        <Divider />
        
        <MenuItem 
          onClick={() => {
            handleProfileMenuClose();
            navigate('/customer/profile');
          }}
        >
          <AccountCircle sx={{ mr: 1 }} /> Profile
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            handleProfileMenuClose();
            navigate('/favorites');
          }}
        >
          <Favorite sx={{ mr: 1 }} /> Favorites
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            handleProfileMenuClose();
            navigate('/orders');
          }}
        >
          <History sx={{ mr: 1 }} /> Orders
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={() => {
            handleProfileMenuClose();
            handleLogout();
          }}
          sx={{ color: 'error.main' }}
        >
          <ExitToApp sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>
      
      {/* Main Content */}
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
          Welcome, {profile?.name || user || 'Valued Customer'}! {/* Safe access */}
        </Typography>
        
        {(restaurantsLoading || profileLoading) && <CircularProgress />}
        
        {error && (
          <Typography color="error" variant="body1">
            Error loading restaurants: {error}
          </Typography>
        )}
        
        {restaurants.length > 0 && (
          <Paper elevation={3} sx={{ width: '100%', padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Available Restaurants
            </Typography>
            <List>
              {restaurants.map((restaurant) => (
                <ListItem 
                  key={restaurant._id} 
                  divider
                  component={Link}
                  to={`/restaurants/${restaurant._id}/menu`}
                  sx={{
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.hover,
                      cursor: 'pointer'
                    },
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <ListItemText
                    primary={restaurant.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" display="block">
                          Cuisine: {restaurant.cuisine}
                        </Typography>
                        <Typography component="span" variant="body2" display="block">
                          Location: {restaurant.address}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
        
        {!restaurantsLoading && restaurants.length === 0 && !error && (
          <Typography variant="body1">
            No restaurants available at the moment.
          </Typography>
        )}
      </Box>
      
      {/* Cart Component */}
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </Container>
  );
};

export default CustomerHome;