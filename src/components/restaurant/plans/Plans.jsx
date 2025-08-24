import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_PLANS } from '../../../utils/apiUtils';

const Plans = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, [id]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      console.log('🔍 [Plans] Fetching plans for restaurant:', id);
      const response = await api.get(`${ADMIN_PLANS}?restaurant=${id}`);
      console.log('🔍 [Plans] API Response:', response);
      
      // Handle different response structures
      let plansData = [];
      if (response && response.data) {
        // Check if response.data has a nested 'data' property (API response structure)
        if (response.data.data && Array.isArray(response.data.data)) {
          plansData = response.data.data;
        } else if (Array.isArray(response.data)) {
          plansData = response.data;
        }
      } else if (response && Array.isArray(response)) {
        plansData = response;
      }
      
      console.log('🔍 [Plans] Extracted plans data:', plansData);
      setPlans(plansData);
    } catch (err) {
      console.error('❌ [Plans] Error fetching plans:', err);
      setError(err.message || 'Failed to fetch plans');
      toast.error('Failed to fetch meal plans');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (planId, currentStatus) => {
    try {
      await api.put(`${ADMIN_PLANS}/${planId}/toggle-status`);
      toast.success('Plan status updated successfully');
      fetchPlans(); // Refresh the list
    } catch (err) {
      toast.error('Failed to update plan status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading meal plans...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Plans</div>
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
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
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
                <h1 className="text-4xl font-bold tracking-tight mb-2">Meal Plans</h1>
                <p className="text-xl text-blue-200 font-medium">Restaurant ID: {id}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {Array.isArray(plans) ? plans.length : 0} Plans
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Meal Plans</h2>
          <button
            onClick={fetchPlans}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            🔄 Refresh
          </button>
        </div>

        {!Array.isArray(plans) || plans.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📋</span>
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-4">
              {!Array.isArray(plans) ? 'Error Loading Plans' : 'No Meal Plans Found'}
            </div>
            <p className="text-gray-500">
              {!Array.isArray(plans) 
                ? 'There was an issue loading the meal plans. Please try refreshing.' 
                : 'This restaurant hasn\'t created any meal plans yet.'
              }
            </p>
            {!Array.isArray(plans) && (
              <button 
                onClick={fetchPlans}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                🔄 Retry
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan._id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Price per Week</label>
                    <p className="text-2xl font-bold text-blue-600">₹{plan.pricePerWeek}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Subscribers</label>
                    <p className="text-gray-900">{plan.totalSubscribers}/{plan.maxSubscribers}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Rating</label>
                    <p className="text-gray-900">⭐ {plan.averageRating} ({plan.totalRatings} reviews)</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-semibold text-gray-700">Features</label>
                  <div className="flex flex-wrap gap-2">
                    {plan.features?.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStatus(plan._id, plan.isActive)}
                    className={`flex-1 px-3 py-2 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                      plan.isActive
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {plan.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => navigate(`/restaurants/${id}/plans/${plan._id}`)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;
