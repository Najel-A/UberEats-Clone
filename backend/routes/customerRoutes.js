const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { isAuthenticated, isCustomer } = require('../middlewares/authMiddleware');
const upload = require('../utils/multer'); // Import Multer

// Existing routes
router.get('/profile', isAuthenticated, isCustomer, customerController.getProfile);
router.get('/favorites', isAuthenticated, isCustomer, customerController.getFavorites);
router.post('/favorites/:restaurantId', isAuthenticated, isCustomer, customerController.addFavorite);
router.delete('/favorites/:restaurantId', isAuthenticated, isCustomer, customerController.removeFavorite);

// Updated PUT /profile route with Multer middleware
router.put(
  '/profile',
  isAuthenticated, // Auth check 1
  isCustomer,     // Auth check 2
  upload.single('profilePicture'), // Multer handles file upload (field name must match!)
  customerController.updateProfile
);

module.exports = router;