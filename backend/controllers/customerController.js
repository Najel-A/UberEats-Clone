const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Favorite = require('../models/Favorite');
const Restaurant = require('../models/Restaurant');
const fs = require('fs');
const path = require('path');


// Get the authenticated user's profile
exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).lean();
    
    if (!customer) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Construct full URL if profilePicture exists
    if (customer.profilePicture) {
      customer.profilePicture = `http://localhost:5000${customer.profilePicture}`;
    }

    delete customer.password;
    res.status(200).json(customer);
    
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ 
      message: 'Error retrieving profile', 
      error: error.message 
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, country, state } = req.body;
    
    // Add /uploads/ prefix to filename
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    console.log('Processed profile picture path:', profilePicture); // Debug log

    const oldCustomer = await Customer.findById(userId);
    
    const updateData = { 
      name, 
      country, 
      state, 
      updatedAt: new Date(),
      ...(profilePicture && { profilePicture }) // Only add if exists
    };

    // Delete old image if it exists
    if (profilePicture && oldCustomer.profilePicture) {
      const oldImagePath = path.join(__dirname, '../', oldCustomer.profilePicture);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Failed to delete old image:', err);
      });
    }

    const customer = await Customer.findByIdAndUpdate(userId, updateData, { new: true });
    res.status(200).json({ 
      message: 'Profile updated successfully', 
      customer 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};

// Get the user's favorite restaurants
// exports.getFavorites = async (req, res) => {
//   try {
//     const userId = req.user.id; // user is set by authenticateJWT middleware

//     const favorites = await Favorite.find({ customer_id: userId }).populate('restaurant_id');
    
//     res.status(200).json(favorites || []);
//   } catch (error) {
//     console.error('Error retrieving favorites:', error);
//     res.status(500).json({ message: 'Error retrieving favorites', error: error.message });
//   }
// };
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ customer_id: req.user.id })
      .populate({
        path: 'restaurant_id',
        select: 'name description location profilePicture openingHours contact_info' // Include all needed fields
      });
    
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a restaurant to favorites
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id; // user is set by authenticateJWT middleware
    const restaurantId = req.params.restaurantId;

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ 
      customer_id: userId, 
      restaurant_id: restaurantId 
    });

    if (existingFavorite) {
      return res.status(400).json({ 
        message: 'Restaurant is already in favorites' 
      });
    }

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
