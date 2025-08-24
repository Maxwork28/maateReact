import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.mangiee.com/api',
  // baseURL: 'http://localhost:3001/api',
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
  // Health Check & Root
  HEALTH_CHECK: '/health',
  ROOT: '/',
  // Admin Authentication
  ADMIN_LOGIN: '/admin/login',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_CHANGE_PASSWORD: '/admin/change-password',
  ADMIN_LOGOUT: '/admin/logout',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAILS: (id) => `/orders/${id}`,
  ORDER_CREATE_FROM_CART: '/orders/create-from-cart',
  ORDER_CREATE_CUSTOM: '/orders/create-custom',
  ORDER_UPDATE_STATUS: (id) => `/orders/${id}/status`,
  ORDER_CANCEL: (id) => `/orders/${id}/cancel`,
  ORDER_DELETE: (id) => `/orders/${id}`,
  ORDER_STATS: '/orders/stats/overview',
  ORDERS_BY_RESTAURANT: (restaurantId) => `/orders/restaurant/${restaurantId}`,
  ORDERS_BY_CUSTOMER: (customerId) => `/orders/customer/${customerId}`,
  
  // Reviews
  REVIEWS: '/reviews',
  REVIEW_DETAILS: (id) => `/reviews/${id}`,
  REVIEWS_BY_RESTAURANT: (restaurantId) => `/reviews/restaurant/${restaurantId}`,
  REVIEW_STATS_BY_RESTAURANT: (restaurantId) => `/reviews/stats/restaurant/${restaurantId}`,
  REVIEW_MARK_HELPFUL: (id) => `/reviews/${id}/helpful`,
  REVIEW_REPORT: (id) => `/reviews/${id}/report`,
  
  // Restaurants
  RESTAURANTS: '/restaurants',
  RESTAURANT_DETAILS: (id) => `/restaurants/${id}`,
  ADMIN_RESTAURANTS: '/admin/restaurants',
  ADMIN_RESTAURANT_DETAILS: (id) => `/admin/restaurants/${id}`,
  
  // Restaurant Items
  RESTAURANT_ITEMS: '/restaurant/items',
  RESTAURANT_ITEMS_BY_RESTAURANT: (restaurantId) => `/restaurant/items/restaurant/${restaurantId}`,
  RESTAURANT_ITEM_DETAILS: (id) => `/restaurant/items/${id}`,
  RESTAURANT_ITEM_CREATE: '/restaurant/items',
  RESTAURANT_ITEM_UPDATE: (id) => `/restaurant/items/${id}`,
  RESTAURANT_ITEM_DELETE: (id) => `/restaurant/items/${id}`,
  RESTAURANT_ITEM_TOGGLE_AVAILABILITY: (id) => `/restaurant/items/${id}/toggle-availability`,
  RESTAURANT_ITEM_STATS: '/restaurant/items/stats',
  RESTAURANT_ITEM_BEST_SELLERS: '/restaurant/items/best-sellers',
  
  // Restaurant Categories
  RESTAURANT_CATEGORIES: '/restaurant/categories',
  RESTAURANT_CATEGORY_DETAILS: (id) => `/restaurant/categories/${id}`,
  RESTAURANT_CATEGORY_CREATE: '/restaurant/categories',
  RESTAURANT_CATEGORY_UPDATE: (id) => `/restaurant/categories/${id}`,
  RESTAURANT_CATEGORY_DELETE: (id) => `/restaurant/categories/${id}`,
  
  // Restaurant Plans
  RESTAURANT_PLANS: '/restaurant/plans',
  RESTAURANT_PLAN_DETAILS: (id) => `/restaurant/plans/${id}`,
  RESTAURANT_PLAN_CREATE: '/restaurant/plans',
  RESTAURANT_PLAN_UPDATE: (id) => `/restaurant/plans/${id}`,
  RESTAURANT_PLAN_DELETE: (id) => `/restaurant/plans/${id}`,
  RESTAURANT_PLAN_TOGGLE_AVAILABILITY: (id) => `/restaurant/plans/${id}/toggle-availability`,
  RESTAURANT_PLAN_STATS: (id) => `/restaurant/plans/${id}/stats`,
  
  // Restaurant Offers
  RESTAURANT_OFFERS: '/restaurant/offers',
  RESTAURANT_OFFER_DETAILS: (id) => `/restaurant/offers/${id}`,
  RESTAURANT_OFFER_CREATE: '/restaurant/offers/create',
  RESTAURANT_OFFER_UPDATE: (id) => `/restaurant/offers/${id}`,
  RESTAURANT_OFFER_DELETE: (id) => `/restaurant/offers/${id}`,
  RESTAURANT_OFFERS_BY_RESTAURANT: (restaurantId) => `/restaurant/offers/public/${restaurantId}`,
  
  // Users
  USERS: '/users',
  USER_DETAILS: (id) => `/users/${id}`,
  USER_PROFILE: '/user/profile',
  USER_PROFILE_UPDATE: '/user/profile',
  USER_PROFILE_COMPLETE: '/user/profile-complete',
  USER_ADDRESSES: '/user/addresses',
  USER_ADDRESS_DETAILS: (addressId) => `/user/addresses/${addressId}`,
  USER_ADDRESS_CREATE: '/user/addresses',
  USER_ADDRESS_UPDATE: (addressId) => `/user/addresses/${addressId}`,
  USER_ADDRESS_DELETE: (addressId) => `/user/addresses/${addressId}`,
  USER_ADDRESS_SET_DEFAULT: (addressId) => `/user/addresses/${addressId}/default`,
  USER_DASHBOARD: '/user/dashboard',
  USER_LOGOUT: '/user/logout',
  
  // User Cart
  USER_CART_ALL: '/user/cart/all',
  USER_CART_BY_RESTAURANT: (restaurantId) => `/user/cart/${restaurantId}`,
  USER_CART_ADD_ITEM: '/user/cart/add-item',
  USER_CART_UPDATE_QUANTITY: '/user/cart/update-quantity',
  USER_CART_REMOVE_ITEM: '/user/cart/remove-item',
  USER_CART_CLEAR: (restaurantId) => `/user/cart/${restaurantId}/clear`,
  USER_CART_SUMMARY: (restaurantId) => `/user/cart/${restaurantId}/summary`,
  
  // User Plans
  USER_PLANS_BY_RESTAURANT: (restaurantId) => `/user/plans/restaurant/${restaurantId}`,
  USER_PLAN_DETAILS: (id) => `/user/plans/${id}`,
  USER_PLAN_STATS: (id) => `/user/plans/${id}/stats`,
  
  // Delivery Men
  DELIVERY_MEN: '/drivers',
  DELIVERY_MAN_DETAILS: (id) => `/drivers/${id}`,
  DRIVER_PROFILE: '/driver/profile',
  DRIVER_PROFILE_UPDATE: '/driver/profile',
  DRIVER_DASHBOARD: '/driver/dashboard',
  DRIVER_ONLINE_STATUS: '/driver/online-status',
  DRIVER_LOGOUT: '/driver/logout',
  DRIVER_REGISTRATION_PROGRESS: '/driver/registration/progress',
  DRIVER_REGISTRATION_PERSONAL: '/driver/registration/personal',
  DRIVER_REGISTRATION_BANK: '/driver/registration/bank-details',
  DRIVER_REGISTRATION_AADHAR: '/driver/registration/aadhar',
  DRIVER_REGISTRATION_LICENSE: '/driver/registration/driving-license',
  DRIVER_REGISTRATION_VEHICLE: '/driver/registration/vehicle',
  DRIVER_REGISTRATION_COMPLETE: '/driver/registration/complete',
  
  // Restaurant Authentication & Profile
  RESTAURANT_SEND_OTP: '/restaurant/send-otp',
  RESTAURANT_VERIFY_OTP: '/restaurant/verify-otp',
  RESTAURANT_REGISTER: '/restaurant/register',
  RESTAURANT_PROFILE: '/restaurant/profile',
  RESTAURANT_PROFILE_UPDATE: '/restaurant/profile',
  RESTAURANT_DASHBOARD: '/restaurant/dashboard',
  RESTAURANT_MESS_IMAGE_REMOVE: (imageUrl) => `/restaurant/mess-image/${imageUrl}`,
  RESTAURANT_MESS_IMAGES_CLEAR: '/restaurant/mess-images',
  RESTAURANT_LOGOUT: '/restaurant/logout',
  RESTAURANT_TOGGLE_ONLINE: '/restaurant/toggle-online',
};

// Admin API Endpoints - Individual constants for direct import
export const ADMIN_PLANS = '/admin/restaurants/plans';
export const ADMIN_PLAN_DETAILS = (id) => `/admin/restaurants/plans/${id}`;
export const ADMIN_PLAN_TOGGLE_STATUS = (id) => `/admin/restaurants/plans/${id}/toggle-status`;
export const ADMIN_PLAN_STATS = '/admin/restaurants/plans/stats';

export const ADMIN_OFFERS = '/admin/restaurants/offers';
export const ADMIN_OFFER_DETAILS = (id) => `/admin/restaurants/offers/${id}`;
export const ADMIN_OFFER_TOGGLE_STATUS = (id) => `/admin/restaurants/offers/${id}/toggle-status`;
export const ADMIN_OFFER_STATS = '/admin/restaurants/offers/stats';

export const ADMIN_ITEMS = '/admin/restaurants/items';
export const ADMIN_ITEM_DETAILS = (id) => `/admin/restaurants/items/${id}`;
export const ADMIN_ITEM_TOGGLE_STATUS = (id) => `/admin/restaurants/items/${id}/toggle-status`;
export const ADMIN_ITEM_AVAILABILITY = (id) => `/admin/restaurants/items/${id}/availability`;
export const ADMIN_ITEM_STATS = '/admin/restaurants/items/stats';

export const ADMIN_CATEGORIES = '/admin/restaurants/categories';
export const ADMIN_CATEGORY_DETAILS = (id) => `/admin/restaurants/categories/${id}`;
export const ADMIN_CATEGORY_TOGGLE_STATUS = (id) => `/admin/restaurants/categories/${id}/toggle-status`;
export const ADMIN_CATEGORY_UPDATE_ITEM_COUNT = (id) => `/admin/restaurants/categories/${id}/update-item-count`;
export const ADMIN_CATEGORY_STATS = '/admin/restaurants/categories/stats';

export const ADMIN_REVIEWS = '/admin/restaurants/reviews';
export const ADMIN_REVIEW_DETAILS = (id) => `/admin/restaurants/reviews/${id}`;
export const ADMIN_REVIEW_TOGGLE_VISIBILITY = (id) => `/admin/restaurants/reviews/${id}/toggle-visibility`;
export const ADMIN_REVIEW_FLAG = (id) => `/admin/restaurants/reviews/${id}/flag`;
export const ADMIN_REVIEW_STATS = '/admin/restaurants/reviews/stats';

export const ADMIN_USERS = '/admin/users';
export const ADMIN_USER_DETAILS = (id) => `/admin/users/profiles/${id}`;
export const ADMIN_USER_TOGGLE_STATUS = (id) => `/admin/users/${id}/toggle-status`;
export const ADMIN_USER_STATS = '/admin/users/stats';

// User Profile Management
export const ADMIN_USER_UPDATE_PROFILE = (id) => `/admin/users/${id}/profile`;
export const ADMIN_USER_VERIFY = (id) => `/admin/users/${id}/verify`;
export const ADMIN_USER_BLOCK = (id) => `/admin/users/${id}/block`;
export const ADMIN_USER_UNBLOCK = (id) => `/admin/users/${id}/unblock`;

// User Search and Filter
export const ADMIN_USER_SEARCH = '/admin/users/search';

// User Activities
export const ADMIN_USER_ACTIVITIES = (id) => `/admin/users/activities/${id}`;
export const ADMIN_USER_ACTIVITIES_STATS = (id) => `/admin/users/${id}/activities/stats`;
export const ADMIN_USER_ENGAGEMENT = (id) => `/admin/users/${id}/activities/engagement`;
export const ADMIN_USER_TIMELINE = (id) => `/admin/users/${id}/activities/timeline`;

// User Addresses
export const ADMIN_USER_ADDRESSES = (id) => `/admin/users/addresses/user/${id}`;
export const ADMIN_USER_ADDRESSES_STATS = (id) => `/admin/users/${id}/addresses/stats`;
export const ADMIN_USER_ADDRESS_TOGGLE = (id, addressId) => `/admin/users/${id}/addresses/${addressId}/toggle-status`;

// User Orders
export const ADMIN_USER_ORDERS = (id) => `/admin/users/orders/${id}`;
export const ADMIN_USER_ORDERS_STATS = (id) => `/admin/users/${id}/orders/stats`;
export const ADMIN_USER_ORDER_DETAILS = (id, orderId) => `/admin/users/${id}/orders/${orderId}`;

// User Reviews
export const ADMIN_USER_REVIEWS = (id) => `/admin/users/reviews/${id}`;
export const ADMIN_USER_REVIEWS_STATS = (id) => `/admin/users/${id}/reviews/stats`;
export const ADMIN_USER_REVIEW_TOGGLE = (id, reviewId) => `/admin/users/${id}/reviews/${reviewId}/toggle-visibility`;
export const ADMIN_USER_REVIEW_FLAG = (id, reviewId) => `/admin/users/${id}/reviews/${reviewId}/flag`;

// User Subscriptions
export const ADMIN_USER_SUBSCRIPTIONS = (id) => `/admin/users/${id}/subscriptions`;
export const ADMIN_USER_SUBSCRIPTIONS_STATS = (id) => `/admin/users/${id}/subscriptions/stats`;
export const ADMIN_USER_SUBSCRIPTION_TOGGLE = (id, subscriptionId) => `/admin/users/${id}/subscriptions/${subscriptionId}/toggle-status`;

// User Payments
export const ADMIN_USER_PAYMENTS = (id) => `/admin/users/payments/${id}`;
export const ADMIN_USER_PAYMENTS_STATS = (id) => `/admin/users/${id}/payments/stats`;
export const ADMIN_USER_PAYMENT_UPDATE = (id, paymentId) => `/admin/users/${id}/payments/${paymentId}/update-status`;

// User Profile Documents
export const ADMIN_USER_PROFILE_DOCUMENTS = (id) => `/admin/users/${id}/profile/documents`;
export const ADMIN_USER_PROFILE_DOCUMENTS_APPROVE = (id) => `/admin/users/${id}/profile/documents/approve`;

export const ADMIN_DRIVERS = '/admin/drivers';
export const ADMIN_DRIVER_DETAILS = (id) => `/admin/drivers/${id}`;
export const ADMIN_DRIVER_TOGGLE_STATUS = (id) => `/admin/drivers/${id}/toggle-status`;
export const ADMIN_DRIVER_STATS = '/admin/drivers/stats';
export const ADMIN_DRIVER_APPROVE = (id) => `/admin/drivers/${id}/approve`;
export const ADMIN_DRIVER_REJECT = (id) => `/admin/drivers/${id}/reject`;
export const ADMIN_DRIVER_BLOCK = (id) => `/admin/drivers/${id}/block`;
export const ADMIN_DRIVER_UNBLOCK = (id) => `/admin/drivers/${id}/unblock`;

export const ADMIN_RESTAURANTS = '/admin/restaurants';
export const ADMIN_RESTAURANT_DETAILS = (id) => `/admin/restaurants/${id}`;
export const ADMIN_RESTAURANT_APPROVE = (id) => `/admin/restaurants/${id}/approve`;
export const ADMIN_RESTAURANT_REJECT = (id) => `/admin/restaurants/${id}/reject`;
export const ADMIN_RESTAURANT_TOGGLE_STATUS = (id) => `/admin/restaurants/${id}/toggle-status`;
export const ADMIN_RESTAURANT_STATS = '/admin/restaurants/stats';

export const ADMIN_ORDERS = '/admin/orders';
export const ADMIN_ORDER_DETAILS = (id) => `/admin/orders/${id}`;
export const ADMIN_ORDER_STATS = '/admin/orders/stats';
export const ADMIN_ORDERS_BY_RESTAURANT = (restaurantId) => `/admin/orders/restaurant/${restaurantId}`;
export const ADMIN_ORDERS_BY_CUSTOMER = (customerId) => `/admin/orders/customer/${customerId}`;
export const ADMIN_ORDER_UPDATE_STATUS = (id) => `/admin/orders/${id}/status`;
export const ADMIN_ORDER_CANCEL = (id) => `/admin/orders/${id}/cancel`;
export const ADMIN_ORDER_DELETE = (id) => `/admin/orders/${id}`;

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

export {
  // Endpoints
  API_ENDPOINTS,
  ADMIN_ENDPOINTS,
};

export default api;
