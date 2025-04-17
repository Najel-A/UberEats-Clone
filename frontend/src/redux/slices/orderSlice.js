// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { clearCart } from './cartSlice';

// // Async Thunks
// export const submitOrder = createAsyncThunk(
//   'order/submitOrder',
//   async (orderData, { getState, dispatch }) => {
//     try {
//       const { token } = getState().auth;
//       const response = await axios.post('http://localhost:5000/api/orders', orderData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });
      
//       dispatch(clearCart());
//       return response.data;
//     } catch (error) {
//       throw error.response?.data?.message || error.message;
//     }
//   }
// );

// export const getCustomerOrders = createAsyncThunk(
//   'order/getCustomerOrders',
//   async (_, { getState }) => {
//     try {
//       const { token, user } = getState().auth; // Get user info
//       console.log('Current user ID:', user?.id); // Debug user ID
      
//       const response = await axios.get('http://localhost:5000/api/orders/customer', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         withCredentials: true
//       });
      
//       console.log('Response data:', {
//         status: response.status,
//         data: response.data,
//         requestUrl: response.config.url
//       });
      
//       return response.data;
//     } catch (error) {
//       console.error('Full error:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status
//       });
//       throw error.response?.data?.message || error.message;
//     }
//   }
// );

// export const cancelOrder = createAsyncThunk(
//   'order/cancelOrder',
//   async (orderId, { getState }) => {
//     try {
//       const { token } = getState().auth;
//       // console.log('Slice Order ID:', orderId); // Debug order ID
//       const response = await axios.put(
//         `http://localhost:5000/api/orders/${orderId}/cancel`, // orderId in URL
//         {}, // Empty body (or add data if needed)
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       throw error.response?.data?.message || error.message;
//     }
//   }
// );

// export const getOrderDetails = createAsyncThunk(
//   'order/getOrderDetails',
//   async (orderId, { getState }) => {
//     try {
//       const { token } = getState().auth;
//       const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         withCredentials: true
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data?.message || error.message;
//     }
//   }
// );

// // Slice
// const orderSlice = createSlice({
//   name: 'order',
//   initialState: {
//     currentOrder: null,
//     orderHistory: [],
//     selectedOrder: null,
//     status: 'idle',
//     error: null,
//     historyStatus: 'idle',
//     cancelStatus: 'idle',
//     detailsStatus: 'idle'
//   },
//   reducers: {
//     resetOrderState: (state) => {
//       state.currentOrder = null;
//       state.status = 'idle';
//       state.error = null;
//     },
//     clearSelectedOrder: (state) => {
//       state.selectedOrder = null;
//       state.detailsStatus = 'idle';
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Submit Order
//       .addCase(submitOrder.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(submitOrder.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.currentOrder = action.payload;
//       })
//       .addCase(submitOrder.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       })
      
//       // Get Customer Orders
//       .addCase(getCustomerOrders.pending, (state) => {
//         state.historyStatus = 'loading';
//         state.error = null;
//       })
//       .addCase(getCustomerOrders.fulfilled, (state, action) => {
//         state.historyStatus = 'succeeded';
//         state.orderHistory = action.payload;
//       })
//       .addCase(getCustomerOrders.rejected, (state, action) => {
//         state.historyStatus = 'failed';
//         state.error = action.error.message;
//       })
      
//       // Cancel Order
//       .addCase(cancelOrder.pending, (state) => {
//         state.cancelStatus = 'loading';
//         state.error = null;
//       })
//       .addCase(cancelOrder.fulfilled, (state, action) => {
//         state.cancelStatus = 'succeeded';
//         // Update the order in history if it exists
//         state.orderHistory = state.orderHistory.map(order => 
//           order._id === action.payload.order._id ? action.payload.order : order
//         );
//         // Also update selected order if it's the one being cancelled
//         if (state.selectedOrder && state.selectedOrder._id === action.payload.order._id) {
//           state.selectedOrder = action.payload.order;
//         }
//       })
//       .addCase(cancelOrder.rejected, (state, action) => {
//         state.cancelStatus = 'failed';
//         state.error = action.error.message;
//       })
      
//       // Get Order Details
//       .addCase(getOrderDetails.pending, (state) => {
//         state.detailsStatus = 'loading';
//         state.error = null;
//       })
//       .addCase(getOrderDetails.fulfilled, (state, action) => {
//         state.detailsStatus = 'succeeded';
//         state.selectedOrder = action.payload;
//       })
//       .addCase(getOrderDetails.rejected, (state, action) => {
//         state.detailsStatus = 'failed';
//         state.error = action.error.message;
//       });
//   }
// });

// export const { resetOrderState, clearSelectedOrder } = orderSlice.actions;
// export default orderSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearCart } from './cartSlice';

// Async Thunks

// Customer Order Thunks
export const submitOrder = createAsyncThunk(
  'order/submitOrder',
  async (orderData, { getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post('http://localhost:5000/api/orders', JSON.stringify(orderData), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }
);

export const getCustomerOrders = createAsyncThunk(
  'order/getCustomerOrders',
  async (_, { getState }) => {
    try {
      const { token, user } = getState().auth;
      console.log('Current user ID:', user?.id);
      
      const response = await axios.get('http://localhost:5000/api/orders/customer', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      
      console.log('Response data:', {
        status: response.status,
        data: response.data,
        requestUrl: response.config.url
      });
      
      return response.data;
    } catch (error) {
      console.error('Full error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error.response?.data?.message || error.message;
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (orderId, { getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }
);

// Restaurant Order Thunks
export const fetchRestaurantOrders = createAsyncThunk(
  'order/fetchRestaurantOrders',
  async (_, { getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get('http://localhost:5000/api/orders/restaurant', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, newStatus }, { getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      return { orderId, newStatus };
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    // Customer order state
    currentOrder: null,
    orderHistory: [],
    selectedOrder: null,
    status: 'idle', // For order submission
    error: null,
    historyStatus: 'idle', // For order history
    cancelStatus: 'idle', // For order cancellation
    detailsStatus: 'idle', // For order details
    
    // Restaurant order state
    restaurantOrders: [],
    restaurantOrdersStatus: 'idle',
    restaurantOrdersError: null,
    statusUpdateStatus: 'idle',
    statusUpdateError: null
  },
  reducers: {
    resetOrderState: (state) => {
      state.currentOrder = null;
      state.status = 'idle';
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.detailsStatus = 'idle';
    },
    resetRestaurantOrdersState: (state) => {
      state.restaurantOrders = [];
      state.restaurantOrdersStatus = 'idle';
      state.restaurantOrdersError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Customer Order Reducers
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
      })
      
      .addCase(getCustomerOrders.pending, (state) => {
        state.historyStatus = 'loading';
        state.error = null;
      })
      .addCase(getCustomerOrders.fulfilled, (state, action) => {
        state.historyStatus = 'succeeded';
        state.orderHistory = action.payload;
      })
      .addCase(getCustomerOrders.rejected, (state, action) => {
        state.historyStatus = 'failed';
        state.error = action.error.message;
      })
      
      .addCase(cancelOrder.pending, (state) => {
        state.cancelStatus = 'loading';
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancelStatus = 'succeeded';
        state.orderHistory = state.orderHistory.map(order => 
          order._id === action.payload.order._id ? action.payload.order : order
        );
        if (state.selectedOrder && state.selectedOrder._id === action.payload.order._id) {
          state.selectedOrder = action.payload.order;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancelStatus = 'failed';
        state.error = action.error.message;
      })
      
      .addCase(getOrderDetails.pending, (state) => {
        state.detailsStatus = 'loading';
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.detailsStatus = 'succeeded';
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.detailsStatus = 'failed';
        state.error = action.error.message;
      })

      // Restaurant Order Reducers
      .addCase(fetchRestaurantOrders.pending, (state) => {
        state.restaurantOrdersStatus = 'loading';
        state.restaurantOrdersError = null;
      })
      .addCase(fetchRestaurantOrders.fulfilled, (state, action) => {
        state.restaurantOrdersStatus = 'succeeded';
        state.restaurantOrders = action.payload;
      })
      .addCase(fetchRestaurantOrders.rejected, (state, action) => {
        state.restaurantOrdersStatus = 'failed';
        state.restaurantOrdersError = action.error.message;
      })
      
      .addCase(updateOrderStatus.pending, (state) => {
        state.statusUpdateStatus = 'loading';
        state.statusUpdateError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.statusUpdateStatus = 'succeeded';
        const { orderId, newStatus } = action.payload;
        state.restaurantOrders = state.restaurantOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        // Also update in orderHistory if it's there
        state.orderHistory = state.orderHistory.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        // Update selectedOrder if it's the one being updated
        if (state.selectedOrder && state.selectedOrder._id === orderId) {
          state.selectedOrder = { ...state.selectedOrder, status: newStatus };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.statusUpdateStatus = 'failed';
        state.statusUpdateError = action.error.message;
      });
  }
});

export const { 
  resetOrderState, 
  clearSelectedOrder,
  resetRestaurantOrdersState 
} = orderSlice.actions;

export default orderSlice.reducer;