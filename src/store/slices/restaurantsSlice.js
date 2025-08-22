import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { ADMIN_RESTAURANTS, ADMIN_RESTAURANT_DETAILS, ADMIN_RESTAURANT_TOGGLE_STATUS, ADMIN_RESTAURANT_APPROVE, ADMIN_RESTAURANT_REJECT } from '../../utils/apiUtils';

// Debug the api import
console.log('🔍 [RestaurantsSlice] API import:', api);
console.log('🔍 [RestaurantsSlice] API type:', typeof api);
console.log('🔍 [RestaurantsSlice] API defaults:', api?.defaults);
console.log('🔍 [RestaurantsSlice] API baseURL:', api?.defaults?.baseURL);

// Async thunks
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_RESTAURANTS, { params });
      return response.data; // Return the data property from axios response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurants');
    }
  }
);

export const fetchRestaurantDetails = createAsyncThunk(
  'restaurants/fetchRestaurantDetails',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_RESTAURANT_DETAILS(restaurantId));
      return response.data; // Return the data property from axios response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurant details');
    }
  }
);

export const approveRestaurant = createAsyncThunk(
  'restaurants/approveRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await api.put(ADMIN_RESTAURANT_APPROVE(restaurantId));
      return response.data; // Return the data property from axios response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to approve restaurant');
    }
  }
);

export const rejectRestaurant = createAsyncThunk(
  'restaurants/rejectRestaurant',
  async ({ restaurantId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(ADMIN_RESTAURANT_REJECT(restaurantId), { reason });
      return response.data; // Return the data property from axios response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to reject restaurant');
    }
  }
);

export const toggleRestaurantStatus = createAsyncThunk(
  'restaurants/toggleRestaurantStatus',
  async (restaurantId, { rejectWithValue }) => {
    try {
      console.log('🔍 [Frontend] Calling toggleRestaurantStatus for ID:', restaurantId);
      console.log('🔍 [Frontend] Using endpoint:', ADMIN_RESTAURANT_TOGGLE_STATUS(restaurantId));
      
      // Debug API object
      console.log('🔍 [Frontend] API object:', api);
      console.log('🔍 [Frontend] API defaults:', api?.defaults);
      console.log('🔍 [Frontend] API baseURL:', api?.defaults?.baseURL);
      
      // Fallback baseURL if api.defaults.baseURL is undefined
      const baseURL = api?.defaults?.baseURL || 'http://localhost:3001/api';
      console.log('🔍 [Frontend] Using baseURL:', baseURL);
      console.log('🔍 [Frontend] Full URL will be:', `${baseURL}${ADMIN_RESTAURANT_TOGGLE_STATUS(restaurantId)}`);
      
      // Check authentication token
      const token = localStorage.getItem('token');
      console.log('🔍 [Frontend] Auth token exists:', !!token);
      console.log('🔍 [Frontend] Auth token length:', token ? token.length : 0);
      
      const response = await api.put(ADMIN_RESTAURANT_TOGGLE_STATUS(restaurantId));
      console.log('🔍 [Frontend] API response:', response);
      console.log('🔍 [Frontend] Response data:', response.data);
      
      return response.data; // Return the data property from axios response
    } catch (error) {
      console.error('🔍 [Frontend] Toggle error:', error);
      console.error('🔍 [Frontend] Error response:', error.response);
      return rejectWithValue(error.response?.data || 'Failed to toggle restaurant status');
    }
  }
);

const initialState = {
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null,
  totalRestaurants: 0,
  filters: {
    status: '',
    cuisine: '',
    search: '',
  },
};

console.log('Restaurants slice - initial state:', initialState);
console.log('Restaurants slice - initial restaurants type:', typeof initialState.restaurants);
console.log('Restaurants slice - initial restaurants isArray:', Array.isArray(initialState.restaurants));

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        console.log('Restaurants slice - fetchRestaurants fulfilled:', action.payload);
        state.loading = false;
        // Ensure restaurants is always an array and handle different response structures
        if (action.payload && action.payload.success) {
          console.log('Restaurants slice - payload success, data:', action.payload.data);
          state.restaurants = Array.isArray(action.payload.data) ? action.payload.data : [];
          state.totalRestaurants = action.payload.total || 0;
        } else {
          console.log('Restaurants slice - payload not successful or missing data');
          state.restaurants = [];
          state.totalRestaurants = 0;
        }
        console.log('Restaurants slice - final state restaurants:', state.restaurants);
        state.error = null;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        console.log('Restaurants slice - fetchRestaurants rejected:', action.payload);
        state.loading = false;
        state.restaurants = []; // Ensure it's always an array
        state.error = action.payload;
      })
      // Fetch Restaurant Details
      .addCase(fetchRestaurantDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDetails.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          state.currentRestaurant = action.payload.data;
        }
        state.error = null;
      })
      .addCase(fetchRestaurantDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve Restaurant
      .addCase(approveRestaurant.fulfilled, (state, action) => {
        if (action.payload && action.payload.success && action.payload.data) {
          const restaurantId = action.payload.data._id;
          // Update in restaurants array
          const restaurant = state.restaurants.find(r => r._id === restaurantId);
          if (restaurant) {
            restaurant.status = 'approved';
          }
          // Also update currentRestaurant if it's the same restaurant
          if (state.currentRestaurant && state.currentRestaurant._id === restaurantId) {
            state.currentRestaurant.status = 'approved';
          }
        }
      })
      // Reject Restaurant
      .addCase(rejectRestaurant.fulfilled, (state, action) => {
        if (action.payload && action.payload.success && action.payload.data) {
          const restaurantId = action.payload.data._id;
          // Update in restaurants array
          const restaurant = state.restaurants.find(r => r._id === restaurantId);
          if (restaurant) {
            restaurant.status = 'rejected';
          }
          // Also update currentRestaurant if it's the same restaurant
          if (state.currentRestaurant && state.currentRestaurant._id === restaurantId) {
            state.currentRestaurant.status = 'rejected';
          }
        }
      })
      // Toggle Restaurant Status
      .addCase(toggleRestaurantStatus.fulfilled, (state, action) => {
        console.log('🔍 [RestaurantsSlice] Toggle fulfilled payload:', action.payload);
        if (action.payload && action.payload.success && action.payload.data) {
          const restaurantId = action.payload.data._id;
          console.log('🔍 [RestaurantsSlice] Toggling restaurant ID:', restaurantId);
          
          // Update in restaurants array
          const restaurant = state.restaurants.find(r => r._id === restaurantId);
          if (restaurant) {
            console.log('🔍 [RestaurantsSlice] Found restaurant in array, current isActive:', restaurant.isActive);
            restaurant.isActive = !restaurant.isActive;
            console.log('🔍 [RestaurantsSlice] Updated restaurant isActive to:', restaurant.isActive);
          }
          
          // Also update currentRestaurant if it's the same restaurant
          if (state.currentRestaurant && state.currentRestaurant._id === restaurantId) {
            console.log('🔍 [RestaurantsSlice] Found currentRestaurant, current isActive:', state.currentRestaurant.isActive);
            state.currentRestaurant.isActive = !state.currentRestaurant.isActive;
            console.log('🔍 [RestaurantsSlice] Updated currentRestaurant isActive to:', state.currentRestaurant.isActive);
          }
        }
      });
  },
});

export const { clearError, setFilters, clearCurrentRestaurant } = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
