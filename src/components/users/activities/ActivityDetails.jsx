import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_USER_ACTIVITIES } from '../../../utils/apiUtils';

const ActivityDetails = () => {
  console.log('🔍 [ActivityDetails] Component function called');
  const { id, activityId } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🔍 [ActivityDetails] Component rendered with:', { id, activityId });

  const fetchActivityDetails = useCallback(async () => {
    if (!activityId || activityId === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [ActivityDetails] Fetching activity details for activityId:', activityId);
      const response = await api.get(`${ADMIN_USER_ACTIVITIES(id)}/${activityId}`);
      console.log('🔍 [ActivityDetails] API Response:', response);

      // Handle different response structures
      let activityData = null;
      if (response && response.data) {
        activityData = response.data.data || response.data;
      } else if (response) {
        activityData = response;
      }

      if (!activityData) {
        throw new Error('No activity data found in response');
      }

      console.log('🔍 [ActivityDetails] Extracted activity data:', activityData);
      setActivity(activityData);
    } catch (error) {
      console.error('❌ [ActivityDetails] Error fetching activity details:', error);
      setError(error.message || 'Failed to fetch activity details');
      toast.error(error.message || 'Failed to fetch activity details');
    } finally {
      setLoading(false);
    }
  }, [activityId, id]);

  useEffect(() => {
    console.log('🔍 [ActivityDetails] useEffect triggered with:', { activityId, id });
    fetchActivityDetails();
  }, [fetchActivityDetails, activityId, id]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      active: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.completed;
    
    return (
      <span className={`px-4 py-2 ${config.bg} ${config.text} text-sm font-semibold rounded-full border ${config.border}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Completed'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading activity details...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Activity</div>
          <div className="text-red-600 mb-6">{error}</div>
          <button 
            onClick={() => navigate(`/users/${id}/activities`)}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">❌</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Activity Not Found</div>
        <p className="text-gray-500 mb-6">The requested activity could not be found</p>
        <button 
          onClick={() => navigate(`/users/${id}/activities`)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Activities
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/users/${id}/activities`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold">Activity Details</h1>
                <p className="text-green-100">View detailed information about this user activity</p>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(activity.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Activity Type</label>
              <p className="text-lg font-semibold text-gray-800">
                {activity.type || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-lg text-gray-800">
                {activity.description || 'No description available'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-2">
                {getStatusBadge(activity.status)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Timestamp</label>
              <p className="text-lg text-gray-800">
                {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Activity ID</label>
              <p className="text-sm font-mono text-gray-600 bg-gray-100 p-2 rounded">
                {activity._id || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="text-sm font-mono text-gray-600 bg-gray-100 p-2 rounded">
                {id || 'N/A'}
              </p>
            </div>
            {activity.metadata && (
              <div>
                <label className="text-sm font-medium text-gray-600">Metadata</label>
                <pre className="text-sm text-gray-600 bg-gray-100 p-3 rounded overflow-auto">
                  {JSON.stringify(activity.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Actions</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(`/users/${id}/activities`)}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200"
          >
            Back to Activities
          </button>
          <button
            onClick={() => navigate(`/users/${id}`)}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View User Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
