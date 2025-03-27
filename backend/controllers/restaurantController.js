const Restaurant = require('../models/Restaurant');

// Get restaurant profile
exports.getProfile = async (req, res) => {
  try {
    const restaurantId = req.user.id;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

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
    const { name, location, description, contactInfo, images, timings } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    await Restaurant.findByIdAndUpdate(restaurantId, { name, location, description, contactInfo, images, timings }, { new: true });

    res.status(200).json({ message: 'Restaurant profile updated successfully' });
  } catch (error) {
    console.error('Error updating restaurant profile:', error);
    res.status(500).json({ message: 'Error updating restaurant profile', error: error.message });
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