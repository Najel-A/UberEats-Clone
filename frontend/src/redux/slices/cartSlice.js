import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], total: 0 };
  } catch {
    return { items: [], total: 0 };
  }
};

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const initialState = loadCartFromStorage();

// Move this before createSlice since it's used in extraReducers
export const submitOrder = createAsyncThunk(
  'cart/submitOrder',
  async (orderData, { getState, dispatch }) => {
    const { token } = getState().auth;
    const response = await axios.post('/api/orders', orderData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(clearCart());
    return response.data;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(
        item => item.dishId === action.payload.dishId
      );
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      state.total = calculateTotal(state.items);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.dishId !== action.payload);
      state.total = calculateTotal(state.items);
    },
    updateQuantity: (state, action) => {
      const { dishId, quantity } = action.payload;
      const item = state.items.find(item => item.dishId === dishId);
      
      if (item) {
        item.quantity = quantity;
        state.total = calculateTotal(state.items);
      }
    },
    clearCart: () => loadCartFromStorage(),
  },
  extraReducers: (builder) => {
    // Add all .addCase() calls FIRST
    builder.addCase(submitOrder.fulfilled, (state, action) => {
      // Handle successful order submission
    });
    
    // THEN add .addMatcher() calls
    builder.addMatcher(
      (action) => action.type.startsWith('cart/'),
      (state) => {
        saveCartToStorage(state);
      }
    );
  }
});

// Helper function to calculate total
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;