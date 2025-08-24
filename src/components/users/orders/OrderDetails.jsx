import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_USER_ORDERS } from '../../../utils/apiUtils';

const OrderDetails = () => {
  console.log('🔍 [OrderDetails] Component function called');
  const { id, orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🔍 [OrderDetails] Component rendered with:', { id, orderId });

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId || orderId === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [OrderDetails] Fetching order details for orderId:', orderId);
      const response = await api.get(`${ADMIN_USER_ORDERS(id)}/${orderId}`);
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
      setError(error.message || 'Failed to fetch order details');
      toast.error(error.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  }, [orderId, id]);

  useEffect(() => {
    console.log('🔍 [OrderDetails] useEffect triggered with:', { orderId, id });
    fetchOrderDetails();
  }, [fetchOrderDetails, orderId, id]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      preparing: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      ready: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    
    return (
      <span className={`px-4 py-2 ${config.bg} ${config.text} text-sm font-semibold rounded-full border ${config.border}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Order</div>
          <div className="text-red-600 mb-6">{error}</div>
          <button 
            onClick={() => navigate(`/users/${id}/orders`)}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
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
          <span className="text-4xl">❌</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Order Not Found</div>
        <p className="text-gray-500 mb-6">The requested order could not be found</p>
        <button 
          onClick={() => navigate(`/users/${id}/orders`)}
          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900 to-orange-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/users/${id}/orders`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold">Order Details</h1>
                <p className="text-orange-100">View detailed information about this order</p>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(order.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Order Number</label>
              <p className="text-lg font-semibold text-gray-800">
                #{order.orderNumber || order._id?.slice(-6) || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Restaurant</label>
              <p className="text-lg text-gray-800">
                {order.restaurant?.name || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-2">
                {getStatusBadge(order.status)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Order Date</label>
              <p className="text-lg text-gray-800">
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Subtotal</label>
              <p className="text-lg text-gray-800">
                ₹{order.subtotal || '0'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Tax</label>
              <p className="text-lg text-gray-800">
                ₹{order.tax || '0'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Delivery Fee</label>
              <p className="text-lg text-gray-800">
                ₹{order.deliveryFee || '0'}
              </p>
            </div>
            <div className="border-t pt-4">
              <label className="text-lg font-semibold text-gray-800">Total Amount</label>
              <p className="text-2xl font-bold text-orange-600">
                ₹{order.totalAmount || '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {item.name ? item.name.charAt(0).toUpperCase() : 'I'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name || 'Item'}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity || 1} • Price: ₹{item.price || '0'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    ₹{(item.price || 0) * (item.quantity || 1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Actions</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(`/users/${id}/orders`)}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200"
          >
            Back to Orders
          </button>
          <button
            onClick={() => navigate(`/users/${id}`)}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View User Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
