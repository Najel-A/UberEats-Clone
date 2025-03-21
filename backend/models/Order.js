const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  status: {
    type: String,
    enum: [
      'New',
      'Preparing',
      'On the Way',
      'Pick-up Ready',
      'Delivered',
      'Picked Up',
      'Cancelled'
    ],
    required: true,
    default: 'New'
  },
  total_price: {
    type: Number,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;