import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  profile: null,
  loading: false,
  error: null,
  success: false,
  favorites: [],
  loadingStates: {
    fetchFavorites: false,
    toggleFavorite: false
  }
};

// Async thunks
export const fetchCustomerProfile = createAsyncThunk(
  'customer/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get('http://localhost:5000/api/customers/profile', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateCustomerProfile = createAsyncThunk(
  'customer/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(
        'http://localhost:5000/api/customers/profile',
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  'customer/fetchFavorites',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get('http://localhost:5000/api/customers/favorites', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      return response.data || []; // Ensure array return
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addFavorite = createAsyncThunk(
  'customer/addFavorite',
  async (restaurantId, { getState, dispatch, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.post(
        `http://localhost:5000/api/customers/favorites/${restaurantId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      // Immediately refresh favorites
      await dispatch(fetchFavorites());
      return restaurantId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'customer/removeFavorite',
  async (restaurantId, { getState, dispatch, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(
        `http://localhost:5000/api/customers/favorites/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      // Immediately refresh favorites
      await dispatch(fetchFavorites());
      return restaurantId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetCustomerState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.favorites = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Profile reducers
      .addCase(fetchCustomerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update profile reducers
      .addCase(updateCustomerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCustomerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
      })
      .addCase(updateCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Favorites reducers
      .addCase(fetchFavorites.pending, (state) => {
        state.loadingStates.fetchFavorites = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loadingStates.fetchFavorites = false;
        state.favorites = (action.payload || []).map(fav => ({
          _id: fav._id,
          restaurant_id: fav.restaurant_id?._id || fav.restaurant_id,
          restaurant_name: fav.restaurant_id?.name,
          restaurant_image: fav.restaurant_id?.image_url,
          cuisine_type: fav.restaurant_id?.cuisine,
          average_rating: fav.restaurant_id?.rating,
          price_level: fav.restaurant_id?.price_level
        }));
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loadingStates.fetchFavorites = false;
        state.error = action.payload;
      })

      // Add/Remove favorite reducers (minimal since we refresh)
      .addCase(addFavorite.pending, (state) => {
        state.loadingStates.toggleFavorite = true;
      })
      .addCase(removeFavorite.pending, (state) => {
        state.loadingStates.toggleFavorite = true;
      })
      .addCase(addFavorite.fulfilled, (state) => {
        state.loadingStates.toggleFavorite = false;
      })
      .addCase(removeFavorite.fulfilled, (state) => {
        state.loadingStates.toggleFavorite = false;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loadingStates.toggleFavorite = false;
        state.error = action.payload;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loadingStates.toggleFavorite = false;
        state.error = action.payload;
      });
  }
});

export const { resetCustomerState, clearProfile } = customerSlice.actions;
export default customerSlice.reducer;