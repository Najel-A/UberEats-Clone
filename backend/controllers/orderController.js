const mongoose = require('mongoose');
const Order = require('../models/Order');
const Dish = require('../models/Dish');
const Customer = require('../models/Customer');
const Restaurant = require('../models/Restaurant');

// Create order directly from items
exports.createOrder = async (req, res) => {
    try {
        const { orderData: { items }, orderData: {customer_id}, orderData: {restaurant_id}, orderData: {total_price} } = req.body;
        const isObjectId = (id) => id instanceof mongoose.Types.ObjectId;

        const order = new Order({
            customer_id: isObjectId(customer_id) ? customer_id : new mongoose.Types.ObjectId(customer_id),
            restaurant_id: isObjectId(restaurant_id) ? restaurant_id : new mongoose.Types.ObjectId(restaurant_id),
            items: items.map(item => ({
                dish: isObjectId(item.dish) ? item.dish : new mongoose.Types.ObjectId(item.dish),
                quantity: item.quantity,
                priceAtTime: item.priceAtTime
            })),
            total_price,
            status: 'New'
        });

        console.log('Order instance before save:', order);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error('Full validation error:', error);
        res.status(400).json({ 
            message: error.message,
            details: error.errors 
        });
    }
};

// Get customer's order history
exports.getCustomerOrders = async (req, res) => {
    try {
        const customerId = req.user.id;
        
        const orders = await Order.find({ customer_id: customerId })
            .populate('restaurant_id', 'name profilePicture')
            .populate({
                path: 'items.dish',
                select: 'name image'
            })
            .sort({ created_at: -1 });
        
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            message: 'Error fetching orders', 
            error: error.message 
        });
    }
};

// Get restaurant's orders
exports.getRestaurantOrders = async (req, res) => {
    try {
        const restaurantId = req.user.id;
        console.log('Restaurant ID:', restaurantId);
        const { status } = req.query;

        const query = { restaurant: restaurantId };
        if (status) {
            query.status = status;
        }

        const orders = await Order.find({ restaurant_id: restaurantId })
            .populate('customer_id', 'name email')
            .populate({
                path: 'items.dish',
                select: 'name image'
            })
            .sort({ created_at: -1 });
        

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching restaurant orders:', error);
        res.status(500).json({ 
            message: 'Error fetching orders', 
            error: error.message 
        });
    }
};

// Update order status (for restaurant)
exports.updateOrderStatus = async (req, res) => {
    try {
        const restaurantId = req.user.id;
        const { order_id } = req.params;
        const { status } = req.body;
        console.log('Restaurant ID:', restaurantId);
        console.log('Order ID:', order_id);
        console.log('Status:', status);

        const order = await Order.findOne({
            _id: order_id,
            restaurant_id: restaurantId
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ 
            message: 'Error updating order status', 
            error: error.message 
        });
    }
};

// Cancel order (for customer)
// Updated cancelOrder controller
exports.cancelOrder = async (req, res) => {
    try {
        const orderId  = req.params.order_id;
        const customerId = req.user.id; // Using authenticated user ID

        console.log('Raw req.params:', req.params.order_id);
        console.log('Raw req.body:', req.body);
        
        console.log('[DEBUG] Cancel Order Request:', {
            orderId,
            customerId
        });

        // Find the order
        const order = await Order.findOne({
            _id: orderId,
            customer_id: customerId
        });

        // If order not found, return 404
        if (!order) {
            console.log('[DEBUG] Order not found or does not belong to customer');
            return res.status(404).json({ 
                success: false,
                message: 'Order not found or unauthorized' 
            });
        }

        // If order is not in 'New' status, return 400
        if (order.status !== 'New') {
            console.log('[DEBUG] Order cannot be cancelled - status:', order.status);
            return res.status(400).json({ 
                success: false,
                message: `Order cannot be cancelled (current status: ${order.status})` 
            });
        }

        // Cancel the order
        order.status = 'Cancelled';
        order.cancelledAt = new Date();
        await order.save();
        
        console.log('[DEBUG] Order cancelled successfully:', order._id);
        
        // Return success
        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order: {
                _id: order._id,
                status: order.status,
                cancelledAt: order.cancelledAt
            }
        });
    } catch (error) {
        console.error('[ERROR] Cancelling order:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to cancel order',
            error: error.message 
        });
    }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
    try {
        const { order_id } = req.params;
        const order = await Order.findById(order_id)
            .populate('customer_id', 'name email')
            .populate('restaurant_id', 'name profilePicture')
            .populate({
                path: 'items.dish',
                select: 'name image description'
            });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ 
            message: 'Error fetching order details', 
            error: error.message 
        });
    }
};