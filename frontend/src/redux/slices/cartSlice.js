import { createSlice } from '@reduxjs/toolkit';

// Helper functions
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], total: 0, restaurantId: null };
  } catch {
    return { items: [], total: 0, restaurantId: null };
  }
};

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { restaurantId, ...dish } = action.payload;
      
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
      }
      
      state.restaurantId = restaurantId;
      
      const existingItem = state.items.find(item => item.dishId === dish.dishId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...dish, quantity: 1 });
      }
      
      state.total = calculateTotal(state.items);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.dishId !== action.payload);
      state.total = calculateTotal(state.items);
      
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    updateQuantity: (state, action) => {
      const { dishId, quantity } = action.payload;
      const item = state.items.find(item => item.dishId === dishId);
      
      if (item) {
        item.quantity = Math.max(1, quantity);
        state.total = calculateTotal(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.restaurantId = null;
    },
    setCartRestaurant: (state, action) => {
      state.restaurantId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type.startsWith('cart/'),
      (state) => {
        saveCartToStorage(state);
      }
    );
  }
});

export const { 
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart,
  setCartRestaurant
} = cartSlice.actions;

export default cartSlice.reducer;