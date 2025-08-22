import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService, ADMIN_PLAN_DETAILS, ADMIN_PLAN_TOGGLE_STATUS } from '../../../utils/apiUtils';

const PlanDetails = () => {
  console.log('🔍 [PlanDetails] Component function called');
  const { id, planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🔍 [PlanDetails] Component rendered with:', { id, planId });

  const fetchPlanDetails = useCallback(async () => {
    if (!planId || planId === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [PlanDetails] Fetching plan details for planId:', planId);
      const response = await apiService.get(ADMIN_PLAN_DETAILS(planId));
      console.log('🔍 [PlanDetails] API Response:', response);

      // Handle different response structures
      let planData = null;
      if (response && response.data) {
        planData = response.data.data || response.data;
      } else if (response) {
        planData = response;
      }

      if (!planData) {
        throw new Error('No plan data found in response');
      }

      console.log('🔍 [PlanDetails] Extracted plan data:', planData);
      setPlan(planData);
    } catch (error) {
      console.error('❌ [PlanDetails] Error fetching plan details:', error);
      setError(error.message || 'Failed to fetch plan details');
      toast.error(error.message || 'Failed to fetch plan details');
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    console.log('🔍 [PlanDetails] useEffect triggered with:', { planId, id });
    fetchPlanDetails();
  }, [fetchPlanDetails, planId, id]);

  const handleToggleStatus = async () => {
    try {
      await apiService.put(ADMIN_PLAN_TOGGLE_STATUS(planId));
      toast.success('Plan status updated successfully');
      fetchPlanDetails(); // Refresh the data
    } catch (error) {
      console.error('❌ [PlanDetails] Error toggling plan status:', error);
      toast.error('Failed to update plan status');
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-200">
        Active
      </span>
    ) : (
      <span className="px-4 py-2 bg-red-100 text-red-800 text-sm font-semibold border border-red-200">
        Inactive
      </span>
    );
  };

  const renderWeeklyMeals = (weeklyMeals) => {
    if (!weeklyMeals || Object.keys(weeklyMeals).length === 0) {
      return <p className="text-gray-500">No weekly meal plan available</p>;
    }

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const mealTypes = ['breakfast', 'lunch', 'dinner'];

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg">
          {/* Table Header */}
          <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-lg">Day</th>
              {mealTypes.map((mealType) => (
                <th key={mealType} className="px-6 py-4 text-left font-bold text-lg capitalize">
                  {mealType}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {days.map((day, dayIndex) => {
              const dayMeals = weeklyMeals[day];
              const hasMeals = dayMeals && (
                dayMeals.breakfast?.length > 0 || 
                dayMeals.lunch?.length > 0 || 
                dayMeals.dinner?.length > 0
              );

              if (!hasMeals) {
                return (
                  <tr key={day} className={`${dayIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                    <td className="px-6 py-4 font-semibold text-gray-900 capitalize border-b border-gray-200">
                      {day}
                    </td>
                    {mealTypes.map((mealType) => (
                      <td key={mealType} className="px-6 py-4 text-gray-500 border-b border-gray-200">
                        <span className="text-sm italic">No meals</span>
                      </td>
                    ))}
                  </tr>
                );
              }

              return (
                <tr key={day} className={`${dayIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                  <td className="px-6 py-4 font-semibold text-gray-900 capitalize border-b border-gray-200">
                    {day}
                  </td>
                  {mealTypes.map((mealType) => {
                    const meals = dayMeals[mealType];
                    
                    if (!meals || meals.length === 0) {
                      return (
                        <td key={mealType} className="px-6 py-4 text-gray-500 border-b border-gray-200">
                          <span className="text-sm italic">No meals</span>
                        </td>
                      );
                    }

                    return (
                      <td key={mealType} className="px-6 py-4 border-b border-gray-200">
                        <div className="space-y-2">
                          {meals.map((meal, mealIndex) => (
                            <div key={mealIndex} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                              <div className="font-medium text-gray-900 text-sm">
                                {meal.name || 'Unnamed Meal'}
                              </div>
                              {meal.calories && (
                                <div className="text-xs text-gray-500 mt-1">
                                  🔥 {meal.calories} calories
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (!planId || planId === 'undefined') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Invalid Plan ID</div>
        <p className="text-gray-500 mb-6">The plan ID is missing or invalid</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/plans`)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Plans
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading plan details...</div>
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
            onClick={fetchPlanDetails}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          >
            Retry
          </button>
          <button
            onClick={() => navigate(`/restaurants/${id}/plans`)}
            className="mt-4 ml-4 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🍽️</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Plan not found</div>
        <p className="text-gray-500 mb-6">The plan you're looking for doesn't exist</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/plans`)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Plans
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/restaurants/${id}/plans`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">{plan.name || 'Unnamed Plan'}</h1>
                <p className="text-xl text-gray-200 font-medium">Meal Plan Details & Management</p>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(plan.isActive)}
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
                onClick={handleToggleStatus}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors duration-200 shadow-md"
              >
                {plan.isActive ? '⏸️ Deactivate Plan' : '▶️ Activate Plan'}
              </button>
            </div>
          </div>

          {/* Restaurant Information */}
          {plan.restaurant && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Restaurant Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                  <p className="text-gray-900 font-medium">{plan.restaurant.businessName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{plan.restaurant.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{plan.restaurant.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">
                    {(plan.restaurant.city || plan.restaurant.state)
                      ? `${plan.restaurant.city || ''}, ${plan.restaurant.state || ''}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Plan Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Name</label>
                <p className="text-gray-900 font-medium">{plan.name || 'Unnamed Plan'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Week</label>
                <p className="text-2xl font-bold text-green-600">₹{plan.pricePerWeek || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                {getStatusBadge(plan.isActive)}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Created Date</label>
                <p className="text-gray-900">
                  {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Subscribers</label>
                <p className="text-gray-900">{plan.totalSubscribers || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Subscribers</label>
                <p className="text-gray-900">{plan.maxSubscribers || 'Unlimited'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Average Rating</label>
                <p className="text-gray-900">⭐ {plan.averageRating || 'No ratings yet'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Ratings</label>
                <p className="text-gray-900">{plan.totalRatings || 0} reviews</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Revenue</label>
                <p className="text-gray-900">₹{plan.totalRevenue || 0}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          {plan.features && plan.features.length > 0 ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Plan Features</h3>
              <div className="flex flex-wrap gap-3">
                {plan.features.map((feature, index) => (
                  <span key={index} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Plan Features</h3>
              <p className="text-gray-500">No features available</p>
            </div>
          )}

          {/* Weekly Meal Plan */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Weekly Meal Plan</h3>
            {renderWeeklyMeals(plan.weeklyMeals)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;