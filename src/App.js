import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store';
import { checkAuthStatus } from './store/slices/authSlice';
import LoginScreen from './components/auth/LoginScreen';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Restaurant from './components/restaurant/Restaurant';
import RestaurantDetails from './components/restaurant/RestaurantDetails';
import Plans from './components/restaurant/plans/Plans';
import PlanDetails from './components/restaurant/plans/PlanDetails';
import Offers from './components/restaurant/offers/Offers';
import OfferDetails from './components/restaurant/offers/OfferDetails';
import Items from './components/restaurant/items/Items';
import Categories from './components/restaurant/categories/Categories';
import Reviews from './components/restaurant/reviews/Reviews';
import ReviewDetails from './components/restaurant/reviews/ReviewDetails';
import Orders from './components/restaurant/orders/Orders';
import OrderDetails from './components/restaurant/orders/OrderDetails';

import ProtectedRoute from './components/ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';

// Placeholder components for other pages
const OrdersManagement = () => <div className="page-content"><h2>Orders Management</h2><p>Orders page coming soon...</p></div>;
const Users = () => <div className="page-content"><h2>Users Management</h2><p>Users page coming soon...</p></div>;
const DeliveryMen = () => <div className="page-content"><h2>Delivery Men Management</h2><p>Delivery men page coming soon...</p></div>;
const Profile = () => <div className="page-content"><h2>Admin Profile</h2><p>Profile page coming soon...</p></div>;

// App component with auth check
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already authenticated
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Layout><OrdersManagement /></Layout></ProtectedRoute>} />
          <Route path="/restaurants" element={<ProtectedRoute><Layout><Restaurant /></Layout></ProtectedRoute>} />
          <Route path="/restaurants/:id" element={<ProtectedRoute><Layout><RestaurantDetails /></Layout></ProtectedRoute>} />
          
          {/* Restaurant-specific routes */}
          <Route path="/restaurants/:id/plans" element={<ProtectedRoute><Layout><Plans /></Layout></ProtectedRoute>} />
          <Route path="/restaurants/:id/plans/:planId" element={<ProtectedRoute><Layout><PlanDetails /></Layout></ProtectedRoute>} />
          <Route path="/restaurants/:id/offers" element={<ProtectedRoute><Layout><Offers /></Layout></ProtectedRoute>} />
          <Route path="/restaurants/:id/offers/:offerId" element={<ProtectedRoute><Layout><OfferDetails /></Layout></ProtectedRoute>} />
          <Route path="/restaurants/:id/items" element={<ProtectedRoute><Layout><Items /></Layout></ProtectedRoute>} />
          <Route path="/restaurants/:id/categories" element={<ProtectedRoute><Layout><Categories /></Layout></ProtectedRoute>} />
          <Route path="/restaurants/:id/reviews" element={<ProtectedRoute><Layout><Reviews /></Layout></ProtectedRoute>} />
          <Route path="/restaurants/:id/reviews/:reviewId" element={<ProtectedRoute><Layout><ReviewDetails /></Layout></ProtectedRoute>} />
          <Route path="/restaurants/:id/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
          <Route path="/restaurants/:id/orders/:orderId" element={<ProtectedRoute><Layout><OrderDetails /></Layout></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>} />
          <Route path="/delivery-men" element={<ProtectedRoute><Layout><DeliveryMen /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
