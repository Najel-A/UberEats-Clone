import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearCart } from './cartSlice'; // Import from cartSlice

export const submitOrder = createAsyncThunk(
  'order/submitOrder',
  async (orderData, { getState, dispatch }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      // Dispatch clearCart action
      dispatch(clearCart());
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    currentOrder: null,
    status: 'idle',
    error: null
  },
  reducers: {
    resetOrderState: (state) => {
      state.currentOrder = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;