import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Grid,
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
import { fetchCustomerProfile, fetchFavorites } from '../../../../redux/slices/customerSlice';
import Cart from '../../components/Cart/Cart';
import RestaurantCard from '../../components/Restaurant/RestaurantCard';

const CustomerHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const { profile, loading: profileLoading } = useSelector(state => state.customer);
  const { restaurants, loading: restaurantsLoading, error } = useSelector(state => state.restaurants);
  const { items } = useSelector(state => state.cart);
  
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (token) {
      dispatch(fetchRestaurants());
      dispatch(fetchCustomerProfile());
      dispatch(fetchFavorites());
    }
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
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
    <Container maxWidth="lg">
      {/* Header with Cart and Profile buttons */}
      <Box sx={{ 
        position: 'fixed', 
        top: 16, 
        right: 16, 
        zIndex: 1200,
        display: 'flex',
        gap: 1
      }}>
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
            {profile?.name || user || 'User'}
          </Typography>
        </Box>
        <Divider />
        
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/customer/profile'); }}>
          <AccountCircle sx={{ mr: 1 }} /> Profile
        </MenuItem>
        
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/customer/favorites'); }}>
          <Favorite sx={{ mr: 1 }} /> Favorites
        </MenuItem>
        
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/orders'); }}>
          <History sx={{ mr: 1 }} /> Orders
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => { handleProfileMenuClose(); handleLogout(); }} sx={{ color: 'error.main' }}>
          <ExitToApp sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>
      
      {/* Main Content */}
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Typography variant="h4" component="h1">
          Welcome, {profile?.name || user || 'Valued Customer'}!
        </Typography>
        
        {(restaurantsLoading || profileLoading) && <CircularProgress />}
        
        {error && (
          <Typography color="error" variant="body1">
            Error loading restaurants: {error}
          </Typography>
        )}
        
        {restaurants.length > 0 && (
          <Paper elevation={3} sx={{ width: '100%', p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Available Restaurants
            </Typography>
            <Grid container spacing={3}>
              {restaurants.map((restaurant) => (
                <Grid item key={restaurant._id} xs={12} sm={6} md={4}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
        
        {!restaurantsLoading && restaurants.length === 0 && !error && (
          <Typography variant="body1">
            No restaurants available at the moment.
          </Typography>
        )}
      </Box>
      
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </Container>
  );
};

export default CustomerHome;