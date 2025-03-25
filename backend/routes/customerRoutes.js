const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { isAuthenticated, isCustomer } = require('../middlewares/authMiddleware');

router.get('/profile', isAuthenticated, isCustomer, customerController.getProfile);
router.put('/profile', isAuthenticated, isCustomer, customerController.updateProfile);
router.get('/favorites', isAuthenticated, isCustomer, customerController.getFavorites);
router.post('/favorites/:restaurantId', isAuthenticated, isCustomer, customerController.addFavorite);
router.delete('/favorites/:restaurantId', isAuthenticated, isCustomer, customerController.removeFavorite);

module.exports = router;
