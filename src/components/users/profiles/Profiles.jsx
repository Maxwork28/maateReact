import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_USER_DETAILS } from '../../../utils/apiUtils';

const Profiles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('🔍 [Profiles] Fetching profile for user:', id);
      const response = await api.get(ADMIN_USER_DETAILS(id));
      console.log('🔍 [Profiles] API Response:', response);
      
      // Handle different response structures
      let profileData = null;
      if (response && response.data) {
        profileData = response.data.data || response.data;
      } else if (response) {
        profileData = response;
      }
      
      console.log('🔍 [Profiles] Extracted profile data:', profileData);
      setProfile(profileData);
    } catch (err) {
      console.error('❌ [Profiles] Error fetching profile:', err);
      setError(err.message || 'Failed to fetch profile');
      toast.error('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const getVerificationBadge = (isVerified) => {
    return isVerified ? (
      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full border border-green-200">
        Verified
      </span>
    ) : (
      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold border border-yellow-200">
        Pending Verification
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      inactive: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      suspended: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' }
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
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading user profile...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Profile</div>
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

  if (!profile) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">❌</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Profile Not Found</div>
        <p className="text-gray-500 mb-6">The requested profile could not be found</p>
        <button 
          onClick={() => navigate(`/users/${id}`)}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to User
        </button>
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
                onClick={() => navigate(`/users/${id}`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold">User Profile</h1>
                <p className="text-teal-100">View and manage user profile information</p>
              </div>
            </div>
            <div className="text-right">
              {getVerificationBadge(profile.isVerified)}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-lg font-semibold text-gray-800">
                {profile.firstName} {profile.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg text-gray-800">
                {profile.email || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-lg text-gray-800">
                {profile.phone || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="text-lg text-gray-800">
                {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="text-sm font-mono text-gray-600 bg-gray-100 p-2 rounded">
                {profile._id || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-2">
                {getStatusBadge(profile.status)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Member Since</label>
              <p className="text-lg text-gray-800">
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Last Updated</label>
              <p className="text-lg text-gray-800">
                {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {profile.address && (
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Street Address</label>
              <p className="text-lg text-gray-800">
                {profile.address.address || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">City</label>
              <p className="text-lg text-gray-800">
                {profile.address.city || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">State</label>
              <p className="text-lg text-gray-800">
                {profile.address.state || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Pincode</label>
              <p className="text-lg text-gray-800">
                {profile.address.pincode || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Actions</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(`/users/${id}`)}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200"
          >
            Back to User
          </button>
          <button
            onClick={() => navigate(`/users/${id}/edit`)}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
