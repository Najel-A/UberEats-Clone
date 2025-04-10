import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Fastfood, Edit, Delete } from '@mui/icons-material';
import { deleteDish } from '../../../../redux/slices/restaurantSlice';

const DishCard = ({ dish }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleEdit = () => {
    navigate(`/restaurant/menu/edit-dish/${dish._id}`, { state: { dish } });
  };
  const handleDelete = () => {
    setDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(deleteDish({dishId: dish._id}));
    setDeleteConfirm(false);
  };

  return (
    <>
      <Card sx={{ 
        width: '100%',
        maxWidth: 300,
        borderRadius: 2,
        boxShadow: 3,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}>
        {/* Dish Image */}
        {dish.image ? (
          <CardMedia
            component="img"
            height="180"
            image={dish.image.startsWith('http') ? dish.image : `http://localhost:5000${dish.image}`}
            alt={dish.name}
            sx={{
              objectFit: 'cover',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            }}
          />
        ) : (
          <Box sx={{ 
            height: 180,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5'
          }}>
            <Fastfood sx={{ fontSize: 60, color: '#9e9e9e' }} />
          </Box>
        )}

        <CardContent>
          {/* Dish Name and Category */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {dish.name}
            </Typography>
            <Chip 
              label={dish.category} 
              size="small" 
              color="primary"
              sx={{ 
                ml: 1,
                textTransform: 'capitalize',
                fontWeight: 'bold'
              }}
            />
          </Box>

          {/* Price */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            ${dish.price.toFixed(2)}
          </Typography>

          {/* Description */}
          {dish.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {dish.description}
            </Typography>
          )}

          {/* Ingredients */}
          {dish.ingredients && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Ingredients:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dish.ingredients}
              </Typography>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <IconButton 
            aria-label="edit"
            onClick={handleEdit}
            color="primary"
            sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 255, 0.1)' } }}
          >
            <Edit />
          </IconButton>
          <IconButton 
            aria-label="delete"
            onClick={handleDelete}
            color="error"
            sx={{ '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' } }}
          >
            <Delete />
          </IconButton>
        </CardActions>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{dish.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DishCard;