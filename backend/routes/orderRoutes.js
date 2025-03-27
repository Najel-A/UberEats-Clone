const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, isCustomer, isRestaurant } = require('../middlewares/authMiddleware');

// Create an order
router.post('/orders', isAuthenticated, isCustomer, orderController.createOrder);

// Get order history for a customer
router.get('/orders/customer', isAuthenticated, isCustomer, orderController.getCustomerOrders);

// Get orders for a restaurant
router.get('/orders/restaurant', isAuthenticated, isRestaurant, orderController.getRestaurantOrders);

// Update order status (for restaurant)
router.put('/orders/:order_id/status', isAuthenticated, isRestaurant, orderController.updateOrderStatus);

// Cancel an order (for customer)
router.put('/orders/:order_id/cancel', isAuthenticated, isCustomer, orderController.cancelOrder);

// Get order details
router.get('/orders/:order_id', isAuthenticated, orderController.getOrderDetails);

module.exports = router;
