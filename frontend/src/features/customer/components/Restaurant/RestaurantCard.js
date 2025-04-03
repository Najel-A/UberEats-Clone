import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../../../../redux/slices/customerSlice';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  const dispatch = useDispatch();
  const { favorites = [] } = useSelector((state) => state.customer);
  const { loadingStates } = useSelector((state) => state.customer);
  const { token } = useSelector((state) => state.auth);

  // Check if current restaurant is favorited
  const isFavorite = favorites.some(fav => fav.restaurant_id === restaurant._id);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert('Please login to save favorites');
      return;
    }

    try {
      if (isFavorite) {
        await dispatch(removeFavorite(restaurant._id)).unwrap();
      } else {
        await dispatch(addFavorite(restaurant._id)).unwrap();
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      // Error is already handled in the slice, no need to show alert
    }
  };

  return (
    <div className="restaurant-card" data-testid="restaurant-card">
      <Link 
        to={`/restaurants/${restaurant._id}/menu`} 
        className="restaurant-link"
        aria-label={`View menu for ${restaurant.name}`}
      >
        <div className="restaurant-image-container">
          <img
            src={restaurant.image_url || '/images/restaurant-placeholder.jpg'}
            alt={restaurant.name}
            className="restaurant-image"
            onError={(e) => {
              e.target.src = '/images/restaurant-placeholder.jpg';
            }}
            loading="lazy"
          />
        </div>

        <div className="restaurant-info">
          <div className="restaurant-header">
            <h3 className="restaurant-name">{restaurant.name}</h3>
            <p className="restaurant-cuisine">{restaurant.cuisine}</p>
          </div>

          <div className="restaurant-footer">
            <div className="restaurant-rating">
              <FaStar className="rating-icon" />
              <span>{restaurant.rating?.toFixed(1) || 'New'}</span>
            </div>

            <div className="restaurant-price">
              {'$'.repeat(restaurant.price_level || 1)}
            </div>

            <button
              onClick={handleFavoriteToggle}
              className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
              disabled={loadingStates.toggleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              data-testid="favorite-button"
            >
              {loadingStates.toggleFavorite ? (
                <div className="loading-spinner"></div>
              ) : isFavorite ? (
                <FaHeart className="favorite-icon" />
              ) : (
                <FaRegHeart className="favorite-icon" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RestaurantCard;