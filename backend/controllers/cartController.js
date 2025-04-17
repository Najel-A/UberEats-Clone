const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const Dish = require('../models/Dish');

// GET Customer Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer_id: req.user.id }).populate('items.dish');
    if (!cart) return res.status(200).json({ items: [] }); // Empty cart

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

// POST items to cart
exports.addItemToCart = async (req, res) => {
  const { dishId, special_instructions = '' } = req.body;
  console.log(req.body);
  const quantity = 1;
  try {
    const dish = await Dish.findById(dishId).populate('restaurant');
    if (!dish) return res.status(404).json({ message: 'Dish not found' });

    let cart = await Cart.findOne({ customer_id: req.user.id });

    // Create new cart if it doesn't exist
    if (!cart) {
      cart = new Cart({
        customer_id: req.user.id,
        restaurant_id: dish.restaurant._id,
        items: [],
      });
    }

    // Enforce only 1 restaurant per cart
    if (cart.restaurant_id.toString() !== dish.restaurant._id.toString()) {
      return res.status(400).json({
        message: 'Cart contains items from another restaurant. Please clear the cart first.',
      });
    }

    const existingItemIndex = cart.items.findIndex((item) => item.dish.toString() === dishId);

    if (existingItemIndex > -1) {
      // Item exists - update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        dish: dish._id,
        quantity,
        priceAtTime: dish.price,
        special_instructions,
      });
    }
    console.log(cart);
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

// Update cart items
exports.updateCartItem = async (req, res) => {
  const { dishId } = req.params;
  const { quantity, special_instructions } = req.body;

  try {
    const cart = await Cart.findOne({ customer_id: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((item) => item.dish.toString() === dishId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = quantity ?? item.quantity;
    item.special_instructions = special_instructions ?? item.special_instructions;

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error updating item', error: err.message });
  }
};

// DELETE item from cart
exports.removeCartItem = async (req, res) => {
  const { dishId } = req.params;

  try {
    const cart = await Cart.findOne({ customer_id: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.dish.toString() !== dishId);

    if (cart.items.length === 0) {
      await cart.deleteOne(); // Clean up empty cart
      return res.status(200).json({ message: 'Cart is now empty' });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
};

// Empty out cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ customer_id: req.user.id });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart', error: err.message });
  }
};
