import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService, API_ENDPOINTS } from '../../utils/apiUtils';

// Async thunks
export const fetchDeliveryMen = createAsyncThunk(
  'deliveryMen/fetchDeliveryMen',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.DELIVERY_MEN, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch delivery men');
    }
  }
);

export const fetchDeliveryManDetails = createAsyncThunk(
  'deliveryMen/fetchDeliveryManDetails',
  async (deliveryManId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.DELIVERY_MAN_DETAILS(deliveryManId));
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch delivery man details');
    }
  }
);

const initialState = {
  deliveryMen: [],
  currentDeliveryMan: null,
  loading: false,
  error: null,
  totalDeliveryMen: 0,
  filters: {
    status: '',
    search: '',
  },
};

const deliveryMenSlice = createSlice({
  name: 'deliveryMen',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentDeliveryMan: (state) => {
      state.currentDeliveryMan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Delivery Men
      .addCase(fetchDeliveryMen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryMen.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryMen = action.payload.deliveryMen || [];
        state.totalDeliveryMen = action.payload.total || 0;
      })
      .addCase(fetchDeliveryMen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Delivery Man Details
      .addCase(fetchDeliveryManDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryManDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDeliveryMan = action.payload.deliveryMan;
      })
      .addCase(fetchDeliveryManDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearCurrentDeliveryMan } = deliveryMenSlice.actions;
export default deliveryMenSlice.reducer;
