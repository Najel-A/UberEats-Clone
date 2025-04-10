import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Box
} from '@mui/material';
import { Add, Close, AddPhotoAlternate, Fastfood, RestaurantMenu } from '@mui/icons-material';
import DishCard from '../../components/Dish/DishCard';
import { fetchRestaurantMenu } from '../../../../redux/slices/restaurantSlice';

const RestaurantMenuPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { menu, loading, error } = useSelector(state => state.restaurants);
  const [newDish, setNewDish] = useState({
    name: '',
    ingredients: '',
    price: 0,
    description: '',
    image: '',
    category: 'Main Course'
  });
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Drink', 'Other'];

  useEffect(() => {
    dispatch(fetchRestaurantMenu());
  }, [dispatch]);

  const handleAddDish = () => {
    navigate('add-dish');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <button 
        className="btn btn-secondary mb-3" 
        onClick={handleGoBack}
      >
        Back
      </button>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Restaurant Menu
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddDish}
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          Add New Dish
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
          {error}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {menu.map(dish => (
            <Grid item key={dish._id} xs={12} sm={6} md={4} lg={3}>
              <DishCard dish={dish} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RestaurantMenuPage;