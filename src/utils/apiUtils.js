import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
const API_ENDPOINTS = {
  // Admin Authentication
  ADMIN_LOGIN: '/admin/login',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_CHANGE_PASSWORD: '/admin/change-password',
  ADMIN_LOGOUT: '/admin/logout',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAILS: (id) => `/orders/${id}`,
  
  // Restaurants
  RESTAURANTS: '/restaurants',
  RESTAURANT_DETAILS: (id) => `/restaurants/${id}`,
  ADMIN_RESTAURANTS: '/admin/restaurants',
  ADMIN_RESTAURANT_DETAILS: (id) => `/admin/restaurants/${id}`,
  
  // Users
  USERS: '/users',
  USER_DETAILS: (id) => `/users/${id}`,
  
  // Delivery Men
  DELIVERY_MEN: '/drivers',
  DELIVERY_MAN_DETAILS: (id) => `/drivers/${id}`,
};

// Admin API Endpoints - Individual constants for direct import
export const ADMIN_PLANS = '/admin/plans';
export const ADMIN_PLAN_DETAILS = (id) => `/admin/plans/${id}`;
export const ADMIN_PLAN_TOGGLE_STATUS = (id) => `/admin/plans/${id}/toggle-status`;
export const ADMIN_PLAN_STATS = '/admin/plans/stats';

export const ADMIN_OFFERS = '/admin/offers';
export const ADMIN_OFFER_DETAILS = (id) => `/admin/offers/${id}`;
export const ADMIN_OFFER_TOGGLE_STATUS = (id) => `/admin/offers/${id}/toggle-status`;
export const ADMIN_OFFER_STATS = '/admin/offers/stats';

export const ADMIN_ITEMS = '/admin/items';
export const ADMIN_ITEM_DETAILS = (id) => `/admin/items/${id}`;
export const ADMIN_ITEM_TOGGLE_STATUS = (id) => `/admin/items/${id}/toggle-status`;
export const ADMIN_ITEM_AVAILABILITY = (id) => `/admin/items/${id}/availability`;
export const ADMIN_ITEM_STATS = '/admin/items/stats';

export const ADMIN_CATEGORIES = '/admin/categories';
export const ADMIN_CATEGORY_DETAILS = (id) => `/admin/categories/${id}`;
export const ADMIN_CATEGORY_TOGGLE_STATUS = (id) => `/admin/categories/${id}/toggle-status`;
export const ADMIN_CATEGORY_UPDATE_ITEM_COUNT = (id) => `/admin/categories/${id}/update-item-count`;
export const ADMIN_CATEGORY_STATS = '/admin/categories/stats';

export const ADMIN_REVIEWS = '/admin/reviews';
export const ADMIN_REVIEW_DETAILS = (id) => `/admin/reviews/${id}`;
export const ADMIN_REVIEW_TOGGLE_VISIBILITY = (id) => `/admin/reviews/${id}/toggle-visibility`;
export const ADMIN_REVIEW_FLAG = (id) => `/admin/reviews/${id}/flag`;
export const ADMIN_REVIEW_STATS = '/admin/reviews/stats';

export const ADMIN_USERS = '/admin/users';
export const ADMIN_USER_DETAILS = (id) => `/admin/users/${id}`;
export const ADMIN_USER_TOGGLE_STATUS = (id) => `/admin/users/${id}/toggle-status`;
export const ADMIN_USER_STATS = '/admin/users/stats';

export const ADMIN_DRIVERS = '/admin/drivers';
export const ADMIN_DRIVER_DETAILS = (id) => `/admin/drivers/${id}`;
export const ADMIN_DRIVER_TOGGLE_STATUS = (id) => `/admin/drivers/${id}/toggle-status`;
export const ADMIN_DRIVER_STATS = '/admin/drivers/stats';

export const ADMIN_RESTAURANTS = '/admin/restaurants';
export const ADMIN_RESTAURANT_DETAILS = (id) => `/admin/restaurants/${id}`;
export const ADMIN_RESTAURANT_APPROVE = (id) => `/admin/restaurants/${id}/approve`;
export const ADMIN_RESTAURANT_REJECT = (id) => `/admin/restaurants/${id}/reject`;
export const ADMIN_RESTAURANT_TOGGLE_STATUS = (id) => `/admin/restaurants/${id}/toggle-status`;
export const ADMIN_RESTAURANT_STATS = '/admin/restaurants/stats';

export const ADMIN_ORDERS = '/admin/orders';
export const ADMIN_ORDER_DETAILS = (id) => `/admin/orders/${id}`;
export const ADMIN_ORDER_STATS = '/admin/orders/stats';

// Admin API Endpoints - Object for grouped access
const ADMIN_ENDPOINTS = {
  // Restaurant Management
  ADMIN_RESTAURANTS,
  ADMIN_RESTAURANT_DETAILS,
  ADMIN_RESTAURANT_APPROVE,
  ADMIN_RESTAURANT_REJECT,
  ADMIN_RESTAURANT_TOGGLE_STATUS,
  ADMIN_RESTAURANT_STATS,

  // Plan Management
  ADMIN_PLANS,
  ADMIN_PLAN_DETAILS,
  ADMIN_PLAN_TOGGLE_STATUS,
  ADMIN_PLAN_STATS,

  // Offer Management
  ADMIN_OFFERS,
  ADMIN_OFFER_DETAILS,
  ADMIN_OFFER_TOGGLE_STATUS,
  ADMIN_OFFER_STATS,

  // Item Management
  ADMIN_ITEMS,
  ADMIN_ITEM_DETAILS,
  ADMIN_ITEM_TOGGLE_STATUS,
  ADMIN_ITEM_AVAILABILITY,
  ADMIN_ITEM_STATS,

  // Category Management
  ADMIN_CATEGORIES,
  ADMIN_CATEGORY_DETAILS,
  ADMIN_CATEGORY_TOGGLE_STATUS,
  ADMIN_CATEGORY_UPDATE_ITEM_COUNT,
  ADMIN_CATEGORY_STATS,

  // Review Management
  ADMIN_REVIEWS,
  ADMIN_REVIEW_DETAILS,
  ADMIN_REVIEW_TOGGLE_VISIBILITY,
  ADMIN_REVIEW_FLAG,
  ADMIN_REVIEW_STATS,

  // User Management
  ADMIN_USERS,
  ADMIN_USER_DETAILS,
  ADMIN_USER_TOGGLE_STATUS,
  ADMIN_USER_STATS,

  // Driver Management
  ADMIN_DRIVERS,
  ADMIN_DRIVER_DETAILS,
  ADMIN_DRIVER_TOGGLE_STATUS,
  ADMIN_DRIVER_STATS,
};

// API service methods
const apiService = {
  // GET request
  get: (url, config = {}) => api.get(url, config),
  
  // POST request
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  
  // PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),
  
  // PATCH request
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
};

export {
  // API service
  apiService,
  
  // Endpoints
  API_ENDPOINTS,
  ADMIN_ENDPOINTS,
};

export default api;
