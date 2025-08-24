import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_USER_SUBSCRIPTIONS } from '../../../utils/apiUtils';

const Subscriptions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, [id]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      console.log('🔍 [Subscriptions] Fetching subscriptions for user:', id);
      const response = await api.get(ADMIN_USER_SUBSCRIPTIONS(id));
      console.log('🔍 [Subscriptions] API Response:', response);
      
      // Handle different response structures
      let subscriptionsData = [];
      if (response && response.data) {
        // Check if response.data has a nested 'data' property (API response structure)
        if (response.data.data && Array.isArray(response.data.data)) {
          subscriptionsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          subscriptionsData = response.data;
        }
      } else if (response && Array.isArray(response)) {
        subscriptionsData = response;
      }
      
      console.log('🔍 [Subscriptions] Extracted subscriptions data:', subscriptionsData);
      setSubscriptions(subscriptionsData);
    } catch (err) {
      console.error('❌ [Subscriptions] Error fetching subscriptions:', err);
      setError(err.message || 'Failed to fetch subscriptions');
      toast.error('Failed to fetch user subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      expired: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.active;
    
    return (
      <span className={`px-3 py-1 ${config.bg} ${config.text} text-sm font-semibold rounded-full border ${config.border}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading user subscriptions...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Subscriptions</div>
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
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
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
                <h1 className="text-3xl font-bold">User Subscriptions</h1>
                <p className="text-purple-100">Manage and monitor user subscriptions</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{subscriptions.length}</div>
              <div className="text-purple-100">Total Subscriptions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Subscription History</h2>
          <p className="text-gray-600 mt-1">All subscriptions for this user</p>
        </div>
        
        {subscriptions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Subscriptions Found</h3>
            <p className="text-gray-500">This user hasn't subscribed to any plans yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {subscriptions.map((subscription, index) => (
              <div key={subscription._id || index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {subscription.plan?.name ? subscription.plan.name.charAt(0).toUpperCase() : 'S'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {subscription.plan?.name || 'Subscription Plan'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {subscription.restaurant?.name || 'Restaurant'} • {subscription.plan?.duration || 'Monthly'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Started: {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : 'N/A'} • 
                        Price: ₹{subscription.price || '0'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      {getStatusBadge(subscription.status)}
                    </div>
                    <button
                      onClick={() => navigate(`/users/${id}/subscriptions/${subscription._id}`)}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors duration-200"
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

export default Subscriptions;
