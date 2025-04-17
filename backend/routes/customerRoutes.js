const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const cartController = require('../controllers/cartController');
const { isAuthenticated, isCustomer } = require('../middlewares/authMiddleware');
const upload = require('../utils/multer'); // Import Multer

// Customer routes
router.get('/profile', isAuthenticated, isCustomer, customerController.getProfile);
router.get('/favorites', isAuthenticated, isCustomer, customerController.getFavorites);
router.post('/favorites/:restaurantId', isAuthenticated, isCustomer, customerController.addFavorite);
router.delete('/favorites/:restaurantId', isAuthenticated, isCustomer, customerController.removeFavorite);

// Cart routes
router.get('/cart', isAuthenticated, isCustomer, cartController.getCart);
router.post('/cart', isAuthenticated, isCustomer, cartController.addItemToCart);
router.put('/cart/:dishId', isAuthenticated, isCustomer, cartController.updateCartItem);
router.delete('/cart/:dishId', isAuthenticated, isCustomer, cartController.removeCartItem);
router.delete('/cart', isAuthenticated, isCustomer, cartController.clearCart);

// Updated PUT /profile route with Multer middleware
router.put(
  '/profile',
  isAuthenticated, // Auth check 1
  isCustomer,     // Auth check 2
  upload.single('profilePicture'), // Multer handles file upload (field name must match!)
  customerController.updateProfile
);

module.exports = router;