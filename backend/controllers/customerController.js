const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Favorite = require('../models/Favorite');
const Restaurant = require('../models/Restaurant');


// Get the authenticated user's profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const customer = await Customer.findById(userId);

    if (!customer) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = customer.toObject();
    delete userProfile.password;

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

// Update the authenticated user's profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // user is set by authenticateJWT middleware
    const { name, profilePicture, country, state } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      userId,
      { name, profilePicture, country, state, updatedAt: new Date() },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get the user's favorite restaurants
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // user is set by authenticateJWT middleware

    const favorites = await Favorite.find({ customer_id: userId }).populate('restaurant_id');
    
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    res.status(500).json({ message: 'Error retrieving favorites', error: error.message });
  }
};

// Add a restaurant to favorites
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id; // user is set by authenticateJWT middleware
    const restaurantId = req.params.restaurantId;

    const newFavorite = new Favorite({ customer_id: userId, restaurant_id: restaurantId });
    await newFavorite.save();

    res.status(201).json({ message: 'Restaurant added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Error adding favorite', error: error.message });
  }
};

// Remove a restaurant from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id; // user is set by authenticateJWT middleware
    const restaurantId = req.params.restaurantId;

    const favorite = await Favorite.findOneAndDelete({ customer_id: userId, restaurant_id: restaurantId });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Restaurant removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Error removing favorite', error: error.message });
  }
};
