const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { isAuthenticated, isRestaurant } = require('../middlewares/authMiddleware');
const upload = require('../utils/multer'); // Import Multer

// Public Routes; maybe add isAuthenticated middleware here?
router.get('/', restaurantController.getAllRestaurants);

// Protected Routes
router.get('/profile', isAuthenticated, isRestaurant, restaurantController.getProfile);
router.put('/profile', isAuthenticated, isRestaurant, upload.single('profilePicture'), restaurantController.updateProfile);

// Placed later to avoid conflicts with other routes
router.get('/:id', restaurantController.getRestaurantById);


module.exports = router;