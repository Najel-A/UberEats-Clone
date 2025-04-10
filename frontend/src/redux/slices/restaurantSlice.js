import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  profile: null,
  restaurants: [],
  menu: [],
  loading: false,
  success: false,
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
      const { id, token } = getState().auth;
      console.log('Restaurant ID:', id); // Log the restaurantId
      const response = await axios.get(
        `http://localhost:5000/api/restaurants/${id}/dishes`,
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

export const updateRestaurantProfile = createAsyncThunk(
  'restaurants/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();

      // 1. Append all text/number fields directly
      formData.append('name', profileData.name);
      formData.append('description', profileData.description);

      // 2. Append nested objects as JSON strings
      formData.append('location', JSON.stringify(profileData.location));
      formData.append('contactInfo', JSON.stringify(profileData.contactInfo));
      formData.append('openingHours', JSON.stringify(profileData.openingHours));

      // 3. Handle the single profile picture
      if (profileData.profilePicture) {
        // Case 1: It's a base64 string (from FileReader)
        if (typeof profileData.profilePicture === 'string' && 
            profileData.profilePicture.startsWith('data:image')) {
          const file = dataURLtoFile(profileData.profilePicture, 'profile.jpg');
          formData.append('profilePicture', file);
        } 
        // Case 2: It's already a File object (direct from file input)
        else if (profileData.profilePicture instanceof File) {
          formData.append('profilePicture', profileData.profilePicture);
        }
      }

      const response = await axios.put(
        'http://localhost:5000/api/restaurants/profile', 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Helper function to convert base64/dataURL to File object
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

// Async thunk for getting restaurant profile
export const fetchRestaurantProfile = createAsyncThunk(
  'restaurants/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get('http://localhost:5000/api/restaurants/profile', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      return response.data;
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
    },
    resetSuccess: (state) => {
      state.success = false;
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
      })

      // Profile reducers
      .addCase(fetchRestaurantProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        })
        .addCase(fetchRestaurantProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update profile reducers
      .addCase(updateRestaurantProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRestaurantProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
      })
      .addCase(updateRestaurantProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearMenu, resetSuccess } = restaurantSlice.actions;
export default restaurantSlice.reducer;