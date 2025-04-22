import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ExitToApp,
  LocalDining
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../../redux/slices/authSlice';
import { fetchRestaurants } from '../../../../redux/slices/restaurantSlice';
import { fetchCustomerProfile, fetchFavorites } from '../../../../redux/slices/customerSlice';
import Cart from '../../components/Cart/Cart';
import RestaurantCard from '../../components/Restaurant/RestaurantCard';
import './CustomerHome.css';

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
  console.log(profile);
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
    <div className="customer-home-container">
      {/* Main Header */}
      <header className="main-header">
        <Link to="/customer/home" className="header-logo">
          <LocalDining className="logo-icon" fontSize="large" />
          <div style={{ display: 'flex' }}>
            <Typography className="logo-text-uber">
              Uber
            </Typography>
            <Typography className="logo-text-eats">
              Eats
            </Typography>
          </div>
        </Link>

        <div className="header-actions">
          <IconButton
            className="header-icon-button"
            onClick={handleProfileMenuOpen}
            aria-label="profile"
            aria-controls="profile-menu"
            aria-haspopup="true"
            aria-expanded={profileMenuOpen ? 'true' : undefined}
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          
          <IconButton 
            className="header-icon-button"
            onClick={toggleCart}
            aria-label="cart"
          >
            <Badge 
              badgeContent={items.length} 
              classes={{ badge: 'cart-badge' }}
              overlap="circular"
            >
              <ShoppingCart fontSize="large" />
            </Badge>
          </IconButton>
        </div>
      </header>
      
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
          className: 'profile-menu',
        }}
      >
        <div className="profile-menu-header">
          <Avatar className="profile-avatar">
            {profile?.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              profile?.name?.charAt(0)
            )}
          </Avatar>
          <Typography className="profile-name">
            {profile?.name || user || 'User'}
          </Typography>
        </div>
        <Divider className="menu-divider" />
        
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/customer/profile'); }} className="menu-item">
          <AccountCircle className="menu-item-icon" /> Profile
        </MenuItem>
        
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/customer/favorites'); }} className="menu-item">
          <Favorite className="menu-item-icon" /> Favorites
        </MenuItem>
        
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/customer/orders'); }} className="menu-item">
          <History className="menu-item-icon" /> Orders
        </MenuItem>
        
        <Divider className="menu-divider" />
        
        <MenuItem onClick={() => { handleProfileMenuClose(); handleLogout(); }} className="menu-item logout-button">
          <ExitToApp className="menu-item-icon" /> Logout
        </MenuItem>
      </Menu>
      
      {/* Main Content */}
      <div className="main-content">
        <Typography className="welcome-title">
          Welcome, {profile?.name || user || 'Valued Customer'}!
        </Typography>
        
        {(restaurantsLoading || profileLoading) && <CircularProgress className="loading-spinner" />}
        
        {error && (
          <Typography className="error-message">
            Error loading restaurants: {error}
          </Typography>
        )}
        
        {restaurants.length > 0 && (
          <div className="restaurants-container">
            <Typography className="restaurants-title">
              Available Restaurants
            </Typography>
            <div className="restaurants-grid">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          </div>
        )}
        
        {!restaurantsLoading && restaurants.length === 0 && !error && (
          <Typography className="no-restaurants">
            No restaurants available at the moment.
          </Typography>
        )}
      </div>
      
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default CustomerHome;