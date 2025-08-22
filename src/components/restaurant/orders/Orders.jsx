import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_ORDERS } from '../../../utils/apiUtils';

const Orders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [id]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('🔍 [Orders] Fetching orders for restaurant:', id);
      
      // Use correct API endpoint for getting orders by restaurant
      const response = await api.get(`${ADMIN_ORDERS}/restaurant/${id}`);
      console.log('🔍 [Orders] API Response:', response);
      
      // Handle different response structures
      let ordersData = [];
      if (response && response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
        }
      } else if (response && Array.isArray(response)) {
        ordersData = response;
      }
      
      console.log('🔍 [Orders] Extracted orders data:', ordersData);
      setOrders(ordersData);
    } catch (err) {
      console.error('❌ [Orders] Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading orders...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Orders</div>
          <div className="text-red-600 mb-6">{error}</div>
          <button 
            onClick={() => navigate(`/restaurants/${id}`)}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Back to Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/restaurants/${id}`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Orders</h1>
                <p className="text-xl text-teal-200 font-medium">Restaurant ID: {id}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {Array.isArray(orders) ? orders.length : 0} Orders
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors duration-200"
          >
            🔄 Refresh
          </button>
        </div>

        {!Array.isArray(orders) || orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-4">
              {!Array.isArray(orders) ? 'Error Loading Orders' : 'No Orders Found'}
            </div>
            <p className="text-gray-500">
              {!Array.isArray(orders) 
                ? 'There was an issue loading the orders. Please try refreshing.' 
                : 'This restaurant hasn\'t received any orders yet.'
              }
            </p>
            {!Array.isArray(orders) && (
              <button 
                onClick={fetchOrders}
                className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors duration-200"
              >
                🔄 Retry
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{order.orderNumber}</h3>
                    <p className="text-gray-600 text-sm">{formatDate(order.orderDate)}</p>
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
                    <p className="text-2xl font-bold text-teal-600">₹{order.totalAmount}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Customer</label>
                    <p className="text-gray-900">
                      {typeof order.customer === 'object' && order.customer.name 
                        ? order.customer.name 
                        : order.customerName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Estimated Delivery</label>
                    <p className="text-gray-900">{order.estimatedDelivery || 'N/A'}</p>
                  </div>
                </div>

                {/* Driver Info */}
                {(order.driver || order.driverName) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Driver</label>
                      <p className="text-gray-900">
                        {typeof order.driver === 'object' && order.driver.name 
                          ? order.driver.name 
                          : order.driverName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Driver Phone</label>
                      <p className="text-gray-900">
                        {typeof order.driver === 'object' && order.driver.phone 
                          ? order.driver.phone 
                          : order.driverPhone || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Order Items</label>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₹{item.price}</p>
                          <p className="text-sm text-gray-600">Total: ₹{item.itemTotal}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-teal-200 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Subtotal: ₹{order.subtotal}</p>
                      <p className="text-lg font-bold text-teal-600">Total: ₹{order.totalAmount}</p>
                    </div>
                    <button
                      onClick={() => {
                        console.log('🔍 [Orders] Navigating to order details:', order._id);
                        navigate(`/restaurants/${id}/orders/${order._id}`);
                      }}
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold text-sm hover:bg-teal-700 transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
