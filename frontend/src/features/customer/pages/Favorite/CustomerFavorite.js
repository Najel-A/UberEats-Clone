import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchFavorites, removeFavorite } from '../../../../redux/slices/customerSlice';
import RestaurantCard from '../../components/Restaurant/RestaurantCard';
import './CustomerFavoritePage.css';

const CustomerFavoritesPage = () => {
  const dispatch = useDispatch();
  const { favorites = [], loadingStates } = useSelector((state) => state.customer);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, token]);

  // Function to handle removing a favorite?
  const handleRemoveFavorite = async (restaurantId) => {
    try {
      await dispatch(removeFavorite(restaurantId)).unwrap();
    } catch (error) {
      console.error('Remove favorite error:', error);
    }
  };

  if (loadingStates.fetchFavorites) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h2 className="mb-3">Please sign in to view your favorites</h2>
          <p className="mb-4">Log in to see your saved restaurants</p>
          <Link to="/login" className="btn btn-primary btn-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!Array.isArray(favorites) || favorites.length === 0) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <img 
            src="/images/empty-favorites.svg" 
            alt="No favorites saved"
            className="img-fluid mb-4"
            style={{ maxWidth: '300px' }}
          />
          <h2 className="mb-3">No Favorites Yet</h2>
          <p className="mb-4">Save your favorite restaurants to see them here</p>
          <Link to="/customer/home" className="btn btn-primary btn-lg">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  console.log('Favorites:', favorites);
  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <h1 className="display-4 mb-3">Your Favorite Restaurants</h1>
        <p className="lead text-muted">{favorites.length} saved</p>
        <Link to="/customer/home" className="btn btn-secondary">
          Back to Home
        </Link>
      </header>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {favorites.map((favorite) => (
          <div className="col" key={favorite._id || favorite.restaurant_id}>
            <RestaurantCard
              restaurant={{
                _id: favorite.restaurant_id,
                name: favorite.restaurant.name,
                description: favorite.restaurant.description,
                location: favorite.restaurant.location,
                profilePicture: favorite.restaurant.profilePicture,
                contact_info: favorite.restaurant.contact_info,
                openingHours: favorite.restaurant.openingHours,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerFavoritesPage;