import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_ORDER_DETAILS } from '../../../utils/apiUtils';

const OrderDetails = () => {
  console.log('🔍 [OrderDetails] Component function called');
  const { id, orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🔍 [OrderDetails] Component rendered with:', { id, orderId });

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId || orderId === 'undefined') {
      console.log('🔍 [OrderDetails] No orderId provided, skipping fetch');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [OrderDetails] Fetching order details for orderId:', orderId);
      console.log('🔍 [OrderDetails] Using API endpoint:', ADMIN_ORDER_DETAILS(orderId));
      
      // Use actual API call
      const response = await api.get(ADMIN_ORDER_DETAILS(orderId));
      console.log('🔍 [OrderDetails] API Response:', response);
      
      // Handle different response structures
      let orderData = null;
      if (response && response.data) {
        orderData = response.data.data || response.data;
      } else if (response) {
        orderData = response;
      }

      if (!orderData) {
        throw new Error('No order data found in response');
      }

      console.log('🔍 [OrderDetails] Extracted order data:', orderData);
      setOrder(orderData);
    } catch (error) {
      console.error('❌ [OrderDetails] Error fetching order details:', error);
      console.error('❌ [OrderDetails] Error response:', error.response);
      console.error('❌ [OrderDetails] Error status:', error.response?.status);
      setError(error.message || 'Failed to fetch order details');
      toast.error(error.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    console.log('🔍 [OrderDetails] useEffect triggered with:', { orderId, id });
    fetchOrderDetails();
  }, [fetchOrderDetails, orderId, id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!orderId || orderId === 'undefined') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Invalid Order ID</div>
        <p className="text-gray-500 mb-6">The order ID is missing or invalid</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/orders`)}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading order details...</div>
          <div className="text-gray-500">Please wait while we fetch the data</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="text-xl font-bold text-red-800">Error Loading Data</div>
          <div className="text-red-600">{error}</div>
          <button
            onClick={fetchOrderDetails}
            className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors duration-200 shadow-lg"
          >
            Retry
          </button>
          <button
            onClick={() => navigate(`/restaurants/${id}/orders`)}
            className="mt-4 ml-4 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📦</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Order not found</div>
        <p className="text-gray-500 mb-6">The order you're looking for doesn't exist</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/orders`)}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 to-cyan-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/restaurants/${id}/orders`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">{order.orderNumber}</h1>
                <p className="text-xl text-teal-200 font-medium">Order Details & Management</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex space-x-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadge(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-2xl font-bold">₹{order.totalAmount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/restaurants/${id}/orders`)}
                className="w-full px-4 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors duration-200 shadow-md"
              >
                📋 Back to Orders
              </button>
              <button
                onClick={() => window.print()}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
              >
                🖨️ Print Order
              </button>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <p className="text-gray-900 font-medium">
                  {typeof order.customer === 'object' && order.customer.name 
                    ? order.customer.name 
                    : order.customerName || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">
                  {typeof order.customer === 'object' && order.customer.phone 
                    ? order.customer.phone 
                    : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">
                  {typeof order.customer === 'object' && order.customer.email 
                    ? order.customer.email 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Restaurant Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Restaurant Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <p className="text-gray-900 font-medium">
                  {typeof order.restaurant === 'object' && order.restaurant.name 
                    ? order.restaurant.name 
                    : order.restaurantName || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <p className="text-gray-900 text-sm">
                  {typeof order.restaurant === 'object' && order.restaurant.location 
                    ? order.restaurant.location 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          {(order.driver || order.driverName) && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Driver Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900 font-medium">
                    {typeof order.driver === 'object' && order.driver.name 
                      ? order.driver.name 
                      : order.driverName || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">
                    {typeof order.driver === 'object' && order.driver.phone 
                      ? order.driver.phone 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Current Location</label>
                  <p className="text-gray-900">
                    {typeof order.driver === 'object' && order.driver.currentLocation 
                      ? order.driver.currentLocation 
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Delivery</label>
                <p className="text-gray-900 font-medium">{order.estimatedDelivery}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Special Instructions</label>
                <p className="text-gray-900 text-sm">{order.specialInstructions || 'None'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order Number</label>
                <p className="text-gray-900 font-medium">{order.orderNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order ID</label>
                <p className="text-gray-900 font-mono text-sm">{order._id}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order Date</label>
                <p className="text-gray-900">{formatDate(order.orderDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order Time</label>
                <p className="text-gray-900">{formatDate(order.orderTime)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tracking Status</label>
                <p className="text-gray-900">{order.trackingStatus}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h3>
            {order.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200">
                  <div className="flex items-start space-x-4">
                    {item.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/default-item.png';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{item.name || 'Unnamed Item'}</h4>
                          <span className="text-lg font-bold text-teal-600">₹{item.itemTotal || 0}</span>
                      </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description || 'No description available'}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Category: {item.category || 'Uncategorized'}</span>
                          <span>Price: ₹{item.price || 0}</span>
                          <span>Qty: {item.quantity || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No items found for this order</p>
              </div>
            )}
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Delivery Address</h3>
            <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-900 font-medium">{order.deliveryAddress.street || 'N/A'}</p>
              <p className="text-gray-900">
                  {order.deliveryAddress.city || 'N/A'}, {order.deliveryAddress.state || 'N/A'} {order.deliveryAddress.postalCode || 'N/A'}
              </p>
                <p className="text-gray-900">{order.deliveryAddress.country || 'N/A'}</p>
            </div>
          </div>
          )}

          {/* Payment Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <p className="text-gray-900 capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusBadge(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction ID</label>
                <p className="text-gray-900 font-mono text-sm">{order.transactionId}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subtotal</label>
                <p className="text-gray-900">₹{order.subtotal}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Amount</label>
                <p className="text-2xl font-bold text-teal-600">₹{order.totalAmount}</p>
              </div>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-teal-600">📦</span>
                </div>
                <p className="text-2xl font-bold text-teal-600">{order.items.length}</p>
                <p className="text-gray-600">Total Items</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-green-600">💰</span>
                </div>
                <p className="text-2xl font-bold text-green-600">₹{order.totalAmount}</p>
                <p className="text-gray-600">Total Value</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-blue-600">⏰</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{order.estimatedDelivery}</p>
                <p className="text-gray-600">Delivery Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
