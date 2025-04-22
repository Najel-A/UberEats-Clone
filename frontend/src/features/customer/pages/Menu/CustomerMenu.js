import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantMenu, clearMenu } from '../../../../redux/slices/restaurantSlice';
import { 
  Typography, 
  CircularProgress, 
  Button,
  Badge,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../../../redux/slices/cartSlice';
import Cart from '../../components/Cart/Cart';
import { AddShoppingCart, Add } from '@mui/icons-material';
import './CustomerMenu.css';

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
    <div className="menu-container">
      <div className="menu-header">
        <Button 
          className="back-button"
          onClick={handleBack}
        >
          Back to Restaurants
        </Button>

        <IconButton 
          className="cart-button"
          onClick={() => setCartOpen(true)}
        >
          <Badge 
            badgeContent={cartItems.length} 
            color="error"
            overlap="circular"
          >
            <AddShoppingCart fontSize="large" />
          </Badge>
        </IconButton>
      </div>

      {loading && (
        <div className="loading-container">
          <CircularProgress className="loading-spinner" />
        </div>
      )}
      
      {error && (
        <Typography className="error-message">
          {error}
        </Typography>
      )}
      
      <div className="menu-card">
        <Typography className="menu-title">
          Menu Items
        </Typography>
        
        {menu && menu.length > 0 ? (
          <div className="menu-list">
            {menu.map((item) => (
              <div 
                key={item._id || item.id} 
                className="menu-item"
              >
                {item.image && (
                  <img
                    className="menu-item-image"
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                  />
                )}
                <div className="menu-item-content">
                  <Typography className="menu-item-name">
                    {item.name}
                  </Typography>
                  <Typography className="menu-item-category">
                    {item.category}
                  </Typography>
                  {item.description && (
                    <Typography className="menu-item-description">
                      {item.description}
                    </Typography>
                  )}
                  <Typography className="menu-item-ingredients">
                    {item.ingredients}
                  </Typography>
                  <Typography className="menu-item-price">
                    Price: ${item.price?.toFixed(2) || 'N/A'}
                  </Typography>
                </div>
                <Button
                  className="add-button"
                  onClick={() => handleAddToCart(item)}
                >
                  <Add /> Add
                </Button>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <Typography className="empty-menu">
              {error ? 'Failed to load menu' : 'No menu items available'}
            </Typography>
          )
        )}
      </div>

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default MenuPage;