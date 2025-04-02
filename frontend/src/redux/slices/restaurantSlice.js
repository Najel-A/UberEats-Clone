// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// const initialState = {
//   restaurants: [],
//   loading: false,
//   error: null,
//   menu: null
// };

// // Async thunk for fetching restaurants
// export const fetchRestaurants = createAsyncThunk(
//   'restaurants/fetchRestaurants',
//   async (_, { getState }) => {
//     const { token } = getState().auth;
//     const response = await axios.get('http://localhost:5000/api/restaurants', {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   }
// );

// // Add this to your existing restaurantSlice.js
// export const fetchRestaurantMenu = createAsyncThunk(
//     'restaurants/fetchRestaurantMenu',
//     async (restaurantId, { getState }) => {
//       const { token } = getState().auth;
//       const response = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}/dishes`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       return response.data;
//     }
//   );

// const restaurantSlice = createSlice({
//   name: 'restaurants',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchRestaurants.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchRestaurants.fulfilled, (state, action) => {
//         state.loading = false;
//         state.restaurants = action.payload;
//       })
//       .addCase(fetchRestaurants.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       .addCase(fetchRestaurantMenu.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchRestaurantMenu.fulfilled, (state, action) => {
//         state.loading = false;
//         state.menu = action.payload;
//       })
//       .addCase(fetchRestaurantMenu.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   }
// });

// export default restaurantSlice.reducer;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  restaurants: [],
  menu: [],  // Changed from null to empty array
  loading: false,
  error: null
};

// Async thunk for fetching restaurants
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get('http://localhost:5000/api/restaurants', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Async thunk for fetching menu
export const fetchRestaurantMenu = createAsyncThunk(
  'restaurants/fetchRestaurantMenu',
  async (restaurantId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(
        `http://localhost:5000/api/restaurants/${restaurantId}/dishes`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data; // This should be an array of dishes
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    clearMenu: (state) => {
      state.menu = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Restaurants reducers
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Menu reducers
      .addCase(fetchRestaurantMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menu = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRestaurantMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.menu = [];
      });
  }
});

export const { clearMenu } = restaurantSlice.actions;
export default restaurantSlice.reducer;