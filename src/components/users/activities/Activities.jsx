import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_USER_ACTIVITIES } from '../../../utils/apiUtils';

const Activities = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, [id]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      console.log('🔍 [Activities] Fetching activities for user:', id);
      const response = await api.get(ADMIN_USER_ACTIVITIES(id));
      console.log('🔍 [Activities] API Response:', response);
      
      // Handle different response structures
      let activitiesData = [];
      if (response && response.data) {
        // Check if response.data has a nested 'data' property (API response structure)
        if (response.data.data && Array.isArray(response.data.data)) {
          activitiesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          activitiesData = response.data;
        }
      } else if (response && Array.isArray(response)) {
        activitiesData = response;
      }
      
      console.log('🔍 [Activities] Extracted activities data:', activitiesData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('❌ [Activities] Error fetching activities:', err);
      setError(err.message || 'Failed to fetch activities');
      toast.error('Failed to fetch user activities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading user activities...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Activities</div>
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
      <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
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
                <h1 className="text-3xl font-bold">User Activities</h1>
                <p className="text-green-100">Manage and monitor user activities</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{activities.length}</div>
              <div className="text-green-100">Total Activities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Activity History</h2>
          <p className="text-gray-600 mt-1">Recent user activities and interactions</p>
        </div>
        
        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Activities Found</h3>
            <p className="text-gray-500">This user hasn't performed any activities yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activities.map((activity, index) => (
              <div key={activity._id || index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {activity.type ? activity.type.charAt(0).toUpperCase() : 'A'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {activity.type || 'Activity'} - {activity.description || 'User action'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {activity.status || 'Completed'}
                    </div>
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

export default Activities;
