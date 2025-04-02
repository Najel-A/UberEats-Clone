import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Button, 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  Paper 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../../redux/slices/authSlice';
import { fetchRestaurants } from '../../../../redux/slices/restaurantSlice';

const CustomerHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const { restaurants, loading, error } = useSelector(state => state.restaurants);

  useEffect(() => {
    if (token) {
      dispatch(fetchRestaurants());
    }
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Container maxWidth="md">
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
          Welcome, {user || 'Valued Customer'}!
        </Typography>
        
        {loading && <CircularProgress />}
        
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
                    textDecoration: 'none', // Removes underline from links
                    color: 'inherit' // Keeps text color consistent
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
        
        {!loading && restaurants.length === 0 && !error && (
          <Typography variant="body1">
            No restaurants available at the moment.
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default CustomerHome;