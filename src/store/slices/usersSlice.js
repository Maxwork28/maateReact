import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { 
  ADMIN_USERS, 
  ADMIN_USER_DETAILS, 
  ADMIN_USER_TOGGLE_STATUS, 
  ADMIN_USER_STATS,
  ADMIN_USER_SEARCH,
  ADMIN_USER_VERIFY,
  ADMIN_USER_BLOCK,
  ADMIN_USER_UNBLOCK,
  ADMIN_USER_ACTIVITIES,
  ADMIN_USER_ACTIVITIES_STATS,
  ADMIN_USER_ADDRESSES,
  ADMIN_USER_ADDRESSES_STATS,
  ADMIN_USER_ORDERS,
  ADMIN_USER_ORDERS_STATS,
  ADMIN_USER_REVIEWS,
  ADMIN_USER_REVIEWS_STATS,
  ADMIN_USER_SUBSCRIPTIONS,
  ADMIN_USER_SUBSCRIPTIONS_STATS,
  ADMIN_USER_PAYMENTS,
  ADMIN_USER_PAYMENTS_STATS
} from '../../utils/apiUtils';

// Async thunks for user management
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USERS, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch users');
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'users/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_DETAILS(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user details');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.put(ADMIN_USER_TOGGLE_STATUS(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to toggle user status');
    }
  }
);

export const getUserStats = createAsyncThunk(
  'users/getUserStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_STATS, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user statistics');
    }
  }
);

// User Profile Management
export const updateUserProfile = createAsyncThunk(
  'users/updateUserProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const response = await api.put(ADMIN_USER_DETAILS(userId), profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update user profile');
    }
  }
);

// User Verification
export const verifyUser = createAsyncThunk(
  'users/verifyUser',
  async ({ userId, adminNote }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${ADMIN_USERS}/${userId}/verify`, { adminNote });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to verify user');
    }
  }
);

// User Block/Unblock
export const blockUser = createAsyncThunk(
  'users/blockUser',
  async ({ userId, reason, adminNote }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${ADMIN_USERS}/${userId}/block`, { reason, adminNote });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to block user');
    }
  }
);

export const unblockUser = createAsyncThunk(
  'users/unblockUser',
  async ({ userId, adminNote }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${ADMIN_USERS}/${userId}/unblock`, { adminNote });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to unblock user');
    }
  }
);

// User Activities
export const fetchUserActivities = createAsyncThunk(
  'users/fetchUserActivities',
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_ACTIVITIES(userId), { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user activities');
    }
  }
);

export const fetchUserActivityStats = createAsyncThunk(
  'users/fetchUserActivityStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_ACTIVITIES_STATS(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user activity stats');
    }
  }
);

// User Addresses
export const fetchUserAddresses = createAsyncThunk(
  'users/fetchUserAddresses',
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_ADDRESSES(userId), { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user addresses');
    }
  }
);

export const fetchUserAddressStats = createAsyncThunk(
  'users/fetchUserAddressStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_ADDRESSES_STATS(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user address stats');
    }
  }
);

// User Orders
export const fetchUserOrders = createAsyncThunk(
  'users/fetchUserOrders',
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_ORDERS(userId), { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user orders');
    }
  }
);

export const fetchUserOrderStats = createAsyncThunk(
  'users/fetchUserOrderStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_ORDERS_STATS(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user order stats');
    }
  }
);

// User Reviews
export const fetchUserReviews = createAsyncThunk(
  'users/fetchUserReviews',
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_REVIEWS(userId), { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user reviews');
    }
  }
);

export const fetchUserReviewStats = createAsyncThunk(
  'users/fetchUserReviewStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_REVIEWS_STATS(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user review stats');
    }
  }
);

// User Subscriptions
export const fetchUserSubscriptions = createAsyncThunk(
  'users/fetchUserSubscriptions',
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_SUBSCRIPTIONS(userId), { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user subscriptions');
    }
  }
);

export const fetchUserSubscriptionStats = createAsyncThunk(
  'users/fetchUserSubscriptionStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_SUBSCRIPTIONS_STATS(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user subscription stats');
    }
  }
);

// User Payments
export const fetchUserPayments = createAsyncThunk(
  'users/fetchUserPayments',
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_PAYMENTS(userId), { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user payments');
    }
  }
);

export const fetchUserPaymentStats = createAsyncThunk(
  'users/fetchUserPaymentStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_USER_PAYMENTS_STATS(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user payment stats');
    }
  }
);

// User Search and Filter
export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (searchParams = {}, { rejectWithValue }) => {
    try {
      console.log('🔍 searchUsers thunk - Input parameters:', searchParams);
      
      // Extract search query from filters
      const { search, status, verified, city, state, page = 1, limit = 10 } = searchParams;
      
      // Build query parameters for backend
      const params = {};
      if (search && search.trim().length >= 2) {
        params.q = search.trim();
      }
      if (page) params.page = page;
      if (limit) params.limit = limit;
      
      console.log('🔍 searchUsers thunk - Backend params:', params);
      console.log('🔍 searchUsers thunk - Calling endpoint:', ADMIN_USER_SEARCH);
      
      const response = await api.get(ADMIN_USER_SEARCH, { params });
      console.log('🔍 searchUsers thunk - Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ searchUsers thunk - Error:', error);
      return rejectWithValue(error.response?.data || 'Failed to search users');
    }
  }
);

// User Engagement Metrics
export const getUserEngagementMetrics = createAsyncThunk(
  'users/getUserEngagementMetrics',
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${ADMIN_USERS}/${userId}/activities/engagement`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user engagement metrics');
    }
  }
);

// User Timeline
export const getUserTimeline = createAsyncThunk(
  'users/getUserTimeline',
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${ADMIN_USERS}/${userId}/activities/timeline`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user timeline');
    }
  }
);

const initialState = {
  users: [],
  currentUser: null,
  userStats: null,
  userActivities: [],
  userAddresses: [],
  userOrders: [],
  userReviews: [],
  userSubscriptions: [],
  userPayments: [],
  userEngagement: null,
  userTimeline: [],
  loading: false,
  error: null,
  totalUsers: 0,
  filters: {
    status: '',
    verified: '',
    search: '',
    city: '',
    state: '',
    dateRange: '',
    page: 1,
    limit: 10
  }
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.currentUser = null;
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data || [];
        state.totalUsers = action.payload.total || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data || action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle User Status
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload.data || action.payload;
        if (state.currentUser && state.currentUser._id === updatedUser._id) {
          state.currentUser = updatedUser;
        }
        const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
      })
      
      // Verify User
      .addCase(verifyUser.fulfilled, (state, action) => {
        const updatedUser = action.payload.data || action.payload;
        if (state.currentUser && state.currentUser._id === updatedUser._id) {
          state.currentUser.isVerified = true;
          state.currentUser.verificationDate = updatedUser.verificationDate;
        }
        const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex].isVerified = true;
          state.users[userIndex].verificationDate = updatedUser.verificationDate;
        }
      })
      
      // Block User
      .addCase(blockUser.fulfilled, (state, action) => {
        const updatedUser = action.payload.data || action.payload;
        if (state.currentUser && state.currentUser._id === updatedUser._id) {
          state.currentUser.isBlocked = true;
          state.currentUser.blockReason = updatedUser.blockReason;
        }
        const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex].isBlocked = true;
          state.users[userIndex].blockReason = updatedUser.blockReason;
        }
      })
      
      // Unblock User
      .addCase(unblockUser.fulfilled, (state, action) => {
        const updatedUser = action.payload.data || action.payload;
        if (state.currentUser && state.currentUser._id === updatedUser._id) {
          state.currentUser.isBlocked = false;
          state.currentUser.blockReason = null;
        }
        const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex].isBlocked = false;
          state.users[userIndex].blockReason = null;
        }
      })
      
      // Get User Stats
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.userStats = action.payload.data || action.payload;
      })
      
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data || [];
        state.totalUsers = action.payload.total || 0;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // User Activities
      .addCase(fetchUserActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.userActivities = action.payload.data || [];
      })
      .addCase(fetchUserActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchUserActivityStats.fulfilled, (state, action) => {
        state.userEngagement = action.payload.data || action.payload;
      })
      
      // User Addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.userAddresses = action.payload.data || [];
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchUserAddressStats.fulfilled, (state, action) => {
        // Update current user with address stats if available
        if (state.currentUser && action.payload.data) {
          state.currentUser.addressesCount = action.payload.data.total || 0;
        }
      })
      
      // User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload.data || [];
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchUserOrderStats.fulfilled, (state, action) => {
        // Update current user with order stats if available
        if (state.currentUser && action.payload.data) {
          state.currentUser.ordersCount = action.payload.data.total || 0;
        }
      })
      
      // User Reviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload.data || [];
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchUserReviewStats.fulfilled, (state, action) => {
        // Update current user with review stats if available
        if (state.currentUser && action.payload.data) {
          state.currentUser.reviewsCount = action.payload.data.total || 0;
        }
      })
      
      // User Subscriptions
      .addCase(fetchUserSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.userSubscriptions = action.payload.data || [];
      })
      .addCase(fetchUserSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchUserSubscriptionStats.fulfilled, (state, action) => {
        // Update current user with subscription stats if available
        if (state.currentUser && action.payload.data) {
          state.currentUser.subscriptionsCount = action.payload.data.total || 0;
        }
      })
      
      // User Payments
      .addCase(fetchUserPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.userPayments = action.payload.data || [];
      })
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchUserPaymentStats.fulfilled, (state, action) => {
        // Update current user with payment stats if available
        if (state.currentUser && action.payload.data) {
          state.currentUser.paymentsCount = action.payload.data.total || 0;
        }
      })
      
      // Update User Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const updatedUser = action.payload.data || action.payload;
        if (state.currentUser && state.currentUser._id === updatedUser._id) {
          state.currentUser = updatedUser;
        }
        const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
      })
      
      // Verify User - handled by the more specific case above
      
      // Block/Unblock User - handled by the more specific cases above
      
      // Search Users - handled by the case above
      
      // Get User Engagement Metrics
      .addCase(getUserEngagementMetrics.fulfilled, (state, action) => {
        state.userEngagement = action.payload.data || action.payload;
      })
      
      // Get User Timeline
      .addCase(getUserTimeline.fulfilled, (state, action) => {
        state.userTimeline = action.payload.data || [];
      });
  }
});

export const { 
  clearUsers, 
  clearCurrentUser, 
  setFilters, 
  clearFilters, 
  setError, 
  clearError 
} = usersSlice.actions;

export default usersSlice.reducer;
