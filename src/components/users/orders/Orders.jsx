import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_USER_ORDERS } from '../../../utils/apiUtils';

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
      console.log('🔍 [Orders] Fetching orders for user:', id);
      const response = await api.get(ADMIN_USER_ORDERS(id));
      console.log('🔍 [Orders] API Response:', response);
      
      // Handle different response structures
      let ordersData = [];
      if (response && response.data) {
        // Check if response.data has a nested 'data' property (API response structure)
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
      toast.error('Failed to fetch user orders');
    } finally {
      setLoading(false);
    }
  };

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
      <span className={`px-3 py-1 ${config.bg} ${config.text} text-sm font-semibold rounded-full border ${config.border}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading user orders...</div>
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
            onClick={() => navigate(`/users/${id}`)}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Back to User
          </button>
        </div>
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
                onClick={() => navigate(`/users/${id}`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold">User Orders</h1>
                <p className="text-orange-100">Manage and monitor user orders</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-orange-100">Total Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
          <p className="text-gray-600 mt-1">All orders placed by this user</p>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Found</h3>
            <p className="text-gray-500">This user hasn't placed any orders yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order, index) => (
              <div key={order._id || index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {order.orderNumber ? order.orderNumber.charAt(0) : 'O'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Order #{order.orderNumber || order._id?.slice(-6) || 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.restaurant?.name || 'Restaurant'} • {order.items?.length || 0} items
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'} • 
                        Total: ₹{order.totalAmount || '0'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                    </div>
                    <button
                      onClick={() => navigate(`/users/${id}/orders/${order._id}`)}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors duration-200"
                    >
                      View
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
