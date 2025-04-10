import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  profile: null,
  restaurants: [],
  menu: [],
  loading: false,
  success: false,
  error: null,
  dishLoading: false,
  dishError: null,
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

// Async thunk for creating a new dish
export const createDish = createAsyncThunk(
  'restaurants/createDish',
  async ({ dishData, restaurantId }, { getState, rejectWithValue }) => {
    try {
      const { token, id } = getState().auth;
      
      const response = await axios.post(
        `http://localhost:5000/api/restaurants/${id}/dishes`,
        dishData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Async thunk for getting dish details
export const fetchDishDetails = createAsyncThunk(
  'restaurants/fetchDishDetails',
  async ({ restaurantId, dishId }, { getState, rejectWithValue }) => {
    try {
      const { token, id } = getState().auth;
      const response = await axios.get(
        `http://localhost:5000/api/restaurants/${id}/dishes/${dishId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Async thunk for updating dish details
export const updateDish = createAsyncThunk(
  'restaurants/updateDish',
  async ({ restaurantId, dishId, dishData }, { getState, rejectWithValue }) => {
    try {
      const { token, id } = getState().auth;
      const response = await axios.put(
        `http://localhost:5000/api/restaurants/${id}/dishes/${dishId}`,
        dishData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Async thunk for deleting a dish
export const deleteDish = createAsyncThunk(
  'restaurants/deleteDish',
  async ({ restaurantId, dishId }, { getState, rejectWithValue }) => {
    try {
      const { token, id } = getState().auth;
      await axios.delete(
        `http://localhost:5000/api/restaurants/${id}/dishes/${dishId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return dishId; // Return the deleted dish ID
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
    },
    resetDishState: (state) => {
      state.dishLoading = false;
      state.dishError = null;
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
      })

      // Dish reducers
      .addCase(createDish.pending, (state) => {
        state.dishLoading = true;
        state.dishError = null;
      })
      .addCase(createDish.fulfilled, (state, action) => {
        state.dishLoading = false;
        // Add the new dish to the menu array
        state.menu = [...state.menu, action.payload];
        state.success = true;
      })
      .addCase(createDish.rejected, (state, action) => {
        state.dishLoading = false;
        state.dishError = action.payload;
      })

      .addCase(fetchDishDetails.pending, (state) => {
        state.dishLoading = true;
        state.dishError = null;
      })
      .addCase(fetchDishDetails.fulfilled, (state, action) => {
        state.dishLoading = false;
        state.currentDish = action.payload;
      })
      .addCase(fetchDishDetails.rejected, (state, action) => {
        state.dishLoading = false;
        state.dishError = action.payload;
      })
      .addCase(updateDish.pending, (state) => {
        state.dishLoading = true;
        state.dishError = null;
      })
      .addCase(updateDish.fulfilled, (state, action) => {
        state.dishLoading = false;
        // Update the dish in the menu array
        state.menu = state.menu.map(dish => 
          dish._id === action.payload._id ? action.payload : dish
        );
        state.success = true;
      })
      .addCase(updateDish.rejected, (state, action) => {
        state.dishLoading = false;
        state.dishError = action.payload;
      })

      // Deleting a dish reducers
      .addCase(deleteDish.pending, (state) => {
        state.dishLoading = true;
        state.dishError = null;
      })
      .addCase(deleteDish.fulfilled, (state, action) => {
        state.dishLoading = false;
        // Remove the deleted dish from the menu array
        state.menu = state.menu.filter(dish => dish._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteDish.rejected, (state, action) => {
        state.dishLoading = false;
        state.dishError = action.payload;
      });
  }
});

export const { clearMenu, resetSuccess, resetDishState } = restaurantSlice.actions;
export default restaurantSlice.reducer;