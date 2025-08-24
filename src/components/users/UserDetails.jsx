import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUserDetails, 
  verifyUser, 
  blockUser, 
  unblockUser, 
  toggleUserStatus,
  fetchUserAddressStats,
  fetchUserOrderStats,
  fetchUserReviewStats,
  fetchUserSubscriptionStats,
  fetchUserPaymentStats
} from '../../store/slices/usersSlice';
import { toast } from 'react-toastify';

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.users);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isToggling, setIsToggling] = useState(false);

  // Helper function to construct full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path, construct full URL
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    return `${baseUrl}${imagePath}`;
  };

  useEffect(() => {
    console.log('UserDetails - ID from params:', id);
    console.log('UserDetails - ID type:', typeof id);
    if (id && id !== 'undefined') {
      dispatch(fetchUserDetails(id));
      // Fetch additional user data
      dispatch(fetchUserAddressStats(id));
      dispatch(fetchUserOrderStats(id));
      dispatch(fetchUserReviewStats(id));
      dispatch(fetchUserSubscriptionStats(id));
      dispatch(fetchUserPaymentStats(id));
    }
  }, [dispatch, id]);

  // Handle ESC key to close image modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showImageModal) {
        setShowImageModal(false);
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showImageModal]);

  // Early return if no valid ID
  if (!id || id === 'undefined') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Invalid User ID</div>
        <p className="text-gray-500 mb-6">The user ID is missing or invalid</p>
        <button 
          onClick={() => navigate('/users')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Users
        </button>
      </div>
    );
  }

  const handleVerify = async () => {
    try {
      await dispatch(verifyUser({ userId: id, reason: 'Admin verification' })).unwrap();
      toast.success('User verified successfully');
      dispatch(fetchUserDetails(id));
    } catch (error) {
      toast.error(error || 'Failed to verify user');
    }
  };

  const handleBlock = async () => {
    try {
      await dispatch(blockUser({ userId: id, reason: blockReason })).unwrap();
      toast.success('User blocked successfully');
      setShowBlockModal(false);
      setBlockReason('');
      dispatch(fetchUserDetails(id));
    } catch (error) {
      toast.error(error || 'Failed to block user');
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      console.log('🔍 [UserDetails] Toggling status for user:', id);
      console.log('🔍 [UserDetails] Current isActive status:', currentUser.isActive);
      console.log('🔍 [UserDetails] User data:', currentUser);
      
      const result = await dispatch(toggleUserStatus(id)).unwrap();
      console.log('🔍 [UserDetails] Toggle result:', result);
      
      toast.success('User status updated successfully');
      // Refresh the user details to get the updated data
      await dispatch(fetchUserDetails(id));
    } catch (error) {
      console.error('🔍 [UserDetails] Toggle error:', error);
      toast.error(error?.message || error || 'Failed to update user status');
    } finally {
      setIsToggling(false);
    }
  };

  const openImageModal = (imageUrl) => {
    console.log('🔍 [UserDetails] Opening image modal with URL:', imageUrl);
    console.log('🔍 [UserDetails] Image URL type:', typeof imageUrl);
    console.log('🔍 [UserDetails] Image URL length:', imageUrl ? imageUrl.length : 0);
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'inactive':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading user details...</div>
          <div className="text-gray-500">Please wait while we fetch the data</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <div className="text-xl font-bold text-red-800">Error Loading Data</div>
            <div className="text-red-600">
              {typeof error === 'string' ? error : error?.message || 'An unknown error occurred'}
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/users')}
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
        >
          Back to Users
        </button>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">👤</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">User not found</div>
        <p className="text-gray-500 mb-6">The user you're looking for doesn't exist</p>
        <button 
          onClick={() => navigate('/users')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Users
        </button>
      </div>
    );
  }

  const user = currentUser;
  
  // Debug: Log the user data structure
  console.log('🔍 [UserDetails] User data:', user);
  console.log('🔍 [UserDetails] Profile fields:', {
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone
  });
  console.log('🔍 [UserDetails] Address fields:', {
    address: user.address,
    city: user.city,
    state: user.state,
    pincode: user.pincode
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/users')}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                  {user.fullName || `${user.firstName} ${user.lastName}`}
                </h1>
                <p className="text-xl text-gray-200 font-medium">User Details & Management</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusBadge(user.isActive ? 'active' : 'inactive')}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Image */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Image</h3>
            <div className="text-center">
              <button
                onClick={() => openImageModal(getFullImageUrl(user.profileImage))}
                className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                disabled={!user.profileImage}
              >
                <img
                  className="w-full h-full object-cover"
                  src={getFullImageUrl(user.profileImage) || '/default-avatar.png'}
                  alt={user.fullName || `${user.firstName} ${user.lastName}`}
                  onError={(e) => {
                    console.log('🔍 [UserDetails] Profile image failed to load:', user.profileImage);
                    console.log('🔍 [UserDetails] Full image URL:', getFullImageUrl(user.profileImage));
                    e.target.src = '/default-avatar.png';
                  }}
                  onLoad={() => console.log('🔍 [UserDetails] Profile image loaded successfully:', getFullImageUrl(user.profileImage))}
                />
              </button>
              <p className="text-sm text-gray-500 mt-2">Click to view larger</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {!user.isVerified && (
                <button 
                  onClick={handleVerify}
                  className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors duration-200 shadow-md"
                >
                  ✅ Verify User
                </button>
              )}
              
              <button 
                onClick={() => setShowBlockModal(true)}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                ❌ Block User
              </button>
              
              <button 
                onClick={handleToggleStatus}
                disabled={isToggling}
                className={`w-full px-4 py-3 text-white rounded-xl font-semibold transition-colors duration-200 shadow-md ${
                  isToggling 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {isToggling ? (
                  '⏳ Processing...'
                ) : (
                  user.isActive ? '⏸️ Deactivate' : '▶️ Activate'
                )}
              </button>
              
              {/* Debug info */}
              <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                <div>Status: {user.isActive ? 'Active' : 'Inactive'}</div>
                <div>isVerified: {String(user.isVerified)}</div>
                <div>ID: {user._id || user.id}</div>
                <div>Profile Image: {user.profileImage || 'Not found'}</div>
                <div>Full Image URL: {getFullImageUrl(user.profileImage) || 'Not available'}</div>
              </div>
            </div>
          </div>

          {/* User-Specific Management */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">User Management</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate(`/users/${id}/orders`)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
              >
                📦 View Orders ({user.ordersCount || 0})
              </button>
              <button 
                onClick={() => navigate(`/users/${id}/reviews`)}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-md"
              >
                ⭐ View Reviews ({user.reviewsCount || 0})
              </button>
              <button 
                onClick={() => navigate(`/users/${id}/addresses`)}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md"
              >
                🏠 View Addresses ({user.addressesCount || 0})
              </button>
              <button 
                onClick={() => navigate(`/users/${id}/activities`)}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-md"
              >
                📊 View Activities
              </button>
              <button 
                onClick={() => navigate(`/users/${id}/subscriptions`)}
                className="w-full px-4 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors duration-200 shadow-md"
              >
                💳 View Subscriptions
              </button>
              <button 
                onClick={() => navigate(`/users/${id}/payments`)}
                className="w-full px-4 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors duration-200 shadow-md"
              >
                💰 View Payments
              </button>
              <button 
                onClick={() => navigate(`/users/${id}/profile`)}
                className="w-full px-4 py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors duration-200 shadow-md"
              >
                👤 View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <p className="text-gray-900 font-medium">{user.fullName || `${user.firstName} ${user.lastName}`}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <p className="text-gray-900 font-medium">{user.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <p className="text-gray-900 font-medium">{user.gender || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <p className="text-gray-900 font-medium">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not specified'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(user.isActive ? 'active' : 'inactive')}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <p className="text-gray-900 font-medium">{user.firstName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <p className="text-gray-900 font-medium">{user.lastName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
                <p className="text-gray-900 font-mono text-sm">{user._id || user.id}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.isVerified ? '✅ Verified' : '❌ Not Verified'}
                </span>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <p className="text-gray-900">{user.address || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <p className="text-gray-900">{user.city || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <p className="text-gray-900">{user.state || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Code</label>
                <p className="text-gray-900">{user.pincode || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Date</label>
                <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Active</label>
                <p className="text-gray-900">{user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.isActive ? '✅ Active' : '❌ Inactive'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              {user.updatedAt && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                  <p className="text-gray-900">{new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Image</label>
                <p className="text-gray-900">{user.profileImage ? 'Available' : 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Addresses Count</label>
                <p className="text-gray-900">{user.addresses ? user.addresses.length : 0} addresses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="relative top-10 mx-auto p-4 border w-full max-w-4xl shadow-2xl rounded-3xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg hover:scale-110"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Image */}
              <div className="text-center">
                <div className="w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    className="w-full h-full object-contain"
                    src={selectedImage}
                    alt="User Profile"
                    onError={(e) => {
                      console.log('🔍 [UserDetails] Modal image failed to load:', selectedImage);
                      e.target.src = '/default-avatar.png';
                    }}
                    onLoad={() => console.log('🔍 [UserDetails] Modal image loaded successfully:', selectedImage)}
                  />
                </div>
                
                {/* Image Info */}
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">User Profile Image</h3>
                  <p className="text-gray-600">Click outside or press ESC to close</p>
                  <p className="text-xs text-gray-500 mt-2">Image URL: {selectedImage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-8 border w-full max-w-md shadow-2xl rounded-3xl bg-white">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">❌</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Block User</h3>
              <p className="text-gray-600 mb-6">
                Please provide a reason for blocking <span className="font-semibold text-gray-900">{user.fullName || `${user.firstName} ${user.lastName}`}</span>
              </p>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter block reason..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                rows="4"
                minLength="10"
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowBlockModal(false);
                    setBlockReason('');
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlock}
                  disabled={blockReason.trim().length < 10}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Block User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
