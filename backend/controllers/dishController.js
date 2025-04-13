const Dish = require('../models/Dish');

// Get all dishes for a specific restaurant
exports.getDishesByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    const dishes = await Dish.find({ restaurant: restaurantId });

    if (!dishes.length) {
      return res.status(404).json({ message: 'No dishes found for this restaurant' });
    }

    res.status(200).json(dishes);
  } catch (error) {
    console.error('Error retrieving dishes:', error);
    res.status(500).json({ message: 'Error retrieving dishes', error: error.message });
  }
};

// Get details for a specific dish
exports.getDishDetails = async (req, res) => {
  try {
    const { restaurantId, dishId } = req.params;

    const dish = await Dish.findOne({
      _id: dishId,
      restaurant: restaurantId
    });

    if (dish.image) {
      dish.image = `http://localhost:5000${dish.image}`;
      console.log('Processed image path:', dish.image); // Debug log
    }

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    res.status(200).json(dish);
  } catch (error) {
    console.error('Error retrieving dish details:', error);
    res.status(500).json({ message: 'Error retrieving dish details', error: error.message });
  }
};

// Add a new dish to a restaurant
exports.addDish = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const { name, ingredients, price, description, category } = req.body;

    // Get the uploaded file path (if available)
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newDish = await Dish.create({
      name,
      ingredients: ingredients, // Convert to array if needed
      price: parseFloat(price), // Ensure price is a number
      description,
      image: imagePath, // Store the file path (or null if no file)
      category,
      restaurant: restaurantId,
    });

    res.status(201).json(newDish);
  } catch (error) {
    console.error('Error adding dish:', error);
    res.status(500).json({ message: 'Error adding dish', error: error.message });
  }
};

// Update dish details
exports.updateDish = async (req, res) => {
  try {
    const { restaurantId, dishId } = req.params;
    const { name, ingredients, price, description, image, category } = req.body;

    const dish = await Dish.findOneAndUpdate(
      { _id: dishId, restaurant: restaurantId },
      {
        name,
        ingredients,
        price,
        description,
        image,
        category,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    res.status(200).json({ message: 'Dish updated successfully' });
  } catch (error) {
    console.error('Error updating dish:', error);
    res.status(500).json({ message: 'Error updating dish', error: error.message });
  }
};

// Delete a dish
exports.deleteDish = async (req, res) => {
  try {
    const { restaurantId, dishId } = req.params;

    const dish = await Dish.findOneAndDelete({
      _id: dishId,
      restaurant: restaurantId
    });

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    console.error('Error deleting dish:', error);
    res.status(500).json({ message: 'Error deleting dish', error: error.message });
  }
};