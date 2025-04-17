const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
      },
    items: [
      {
        dish: {  // Changed from dish_id to match your request
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Dish',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtTime: {  // Changed from price to match your request
          type: Number,
          required: true,
        },
        // Removed 'name' requirement since it's not in your request
        // Kept special_instructions as optional
        special_instructions: {
          type: String,
          default: '',
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;