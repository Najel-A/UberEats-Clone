const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');
const { isAuthenticated, isRestaurant } = require('../middlewares/authMiddleware');
const upload = require('../utils/multer'); // Import Multer

// Public routes for customers; maybe apply middleware here?
router.get('/restaurants/:restaurantId/dishes', dishController.getDishesByRestaurant);
router.get('/restaurants/:restaurantId/dishes/:dishId', dishController.getDishDetails);

// Protected routes for restaurant
router.post('/restaurants/:restaurantId/dishes', isAuthenticated, isRestaurant, upload.single('image'), dishController.addDish);
router.put('/restaurants/:restaurantId/dishes/:dishId', isAuthenticated, isRestaurant, dishController.updateDish);
router.delete('/restaurants/:restaurantId/dishes/:dishId', isAuthenticated, isRestaurant, dishController.deleteDish);

module.exports = router;