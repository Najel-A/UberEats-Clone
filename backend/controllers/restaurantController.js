const Restaurant = require('../models/Restaurant');
const fs = require('fs');
const path = require('path');

// Get restaurant profile
exports.getProfile = async (req, res) => {
  try {
    const restaurantId = req.user.id;

    const restaurant = await Restaurant.findById(restaurantId).lean();
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    console.log('Restaurant: ', restaurant);
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error retrieving restaurant profile:', error);
    res.status(500).json({ message: 'Error retrieving restaurant profile', error: error.message });
  }
};

// Update restaurant profile
exports.updateProfile = async (req, res) => {
  try {
    const restaurantId = req.user.id;
    const { name, description, location, contactInfo, openingHours } = req.body;
    
    // Handle profile picture the same way as customer side
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : undefined;
    console.log('Processed profile picture path:', profilePicture);

    const oldRestaurant = await Restaurant.findById(restaurantId);
    if (!oldRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Prepare update data - keep structure similar to customer version
    const updateData = { 
      name,
      description,
      location: JSON.parse(location),
      contactInfo: JSON.parse(contactInfo),
      openingHours: JSON.parse(openingHours),
      updatedAt: new Date(),
      ...(profilePicture && { profilePicture }) // Same conditional spread
    };

    // Same image cleanup logic as customer side
    if (profilePicture && oldRestaurant.profilePicture) {
      const oldImagePath = path.join(__dirname, '../', oldRestaurant.profilePicture);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Failed to delete old image:', err);
      });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId, 
      updateData, 
      { new: true }
    );
    
    // Return the same response structure as customer side
    res.status(200).json({ 
      message: 'Profile updated successfully', 
      restaurant: updatedRestaurant 
    });

  } catch (error) {
    console.error('Error updating restaurant profile:', error);
    res.status(500).json({ 
      message: 'Error updating restaurant profile', 
      error: error.message 
    });
  }
};

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({}, {
            _id: 1,
            name: 1,
            description: 1,
            location: 1,
            contactInfo: 1,
            cuisine: 1,
            deliveryTime: 1,
            rating: 1,
            priceRange: 1,
            profilePicture: 1
        });
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error retrieving restaurants:', error);
        res.status(500).json({ 
            message: 'Error retrieving restaurants', 
            error: error.message 
        });
    }
};

// Get specific restaurant by ID
exports.getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id, {
            _id: 1,
            name: 1,
            description: 1,
            location: 1,
            contactInfo: 1,
            cuisine: 1,
            deliveryTime: 1,
            rating: 1,
            priceRange: 1,
            profilePicture: 1
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        console.error('Error retrieving restaurant:', error);
        res.status(500).json({ 
            message: 'Error retrieving restaurant', 
            error: error.message 
        });
    }
};