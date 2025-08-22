import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantDetails, approveRestaurant, rejectRestaurant, toggleRestaurantStatus } from '../../store/slices/restaurantsSlice';
import { toast } from 'react-toastify';

const RestaurantDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRestaurant, loading, error } = useSelector((state) => state.restaurants);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
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
    console.log('RestaurantDetails - ID from params:', id);
    console.log('RestaurantDetails - ID type:', typeof id);
    if (id && id !== 'undefined') {
      dispatch(fetchRestaurantDetails(id));
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
        <div className="text-xl font-semibold text-gray-700 mb-4">Invalid Restaurant ID</div>
        <p className="text-gray-500 mb-6">The restaurant ID is missing or invalid</p>
        <button 
          onClick={() => navigate('/restaurants')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  const handleApprove = async () => {
    try {
      await dispatch(approveRestaurant(id)).unwrap();
      toast.success('Restaurant approved successfully');
      dispatch(fetchRestaurantDetails(id));
    } catch (error) {
      toast.error(error || 'Failed to approve restaurant');
    }
  };

  const handleReject = async () => {
    try {
      await dispatch(rejectRestaurant({ restaurantId: id, reason: rejectionReason })).unwrap();
      toast.success('Restaurant rejected successfully');
      setShowRejectModal(false);
      setRejectionReason('');
      dispatch(fetchRestaurantDetails(id));
    } catch (error) {
      toast.error(error || 'Failed to reject restaurant');
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      console.log('🔍 [RestaurantDetails] Toggling status for restaurant:', id);
      console.log('🔍 [RestaurantDetails] Current isActive status:', currentRestaurant.isActive);
      console.log('🔍 [RestaurantDetails] Restaurant data:', currentRestaurant);
      
      const result = await dispatch(toggleRestaurantStatus(id)).unwrap();
      console.log('🔍 [RestaurantDetails] Toggle result:', result);
      
      toast.success('Restaurant status updated successfully');
      // Refresh the restaurant details to get the updated data
      await dispatch(fetchRestaurantDetails(id));
    } catch (error) {
      console.error('🔍 [RestaurantDetails] Toggle error:', error);
      toast.error(error?.message || error || 'Failed to update restaurant status');
    } finally {
      setIsToggling(false);
    }
  };

  const openImageModal = (imageUrl) => {
    console.log('🔍 [RestaurantDetails] Opening image modal with URL:', imageUrl);
    console.log('🔍 [RestaurantDetails] Image URL type:', typeof imageUrl);
    console.log('🔍 [RestaurantDetails] Image URL length:', imageUrl ? imageUrl.length : 0);
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rejected':
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
          <div className="text-xl font-semibold text-gray-700">Loading restaurant details...</div>
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
          onClick={() => navigate('/restaurants')}
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  if (!currentRestaurant) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🏪</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Restaurant not found</div>
        <p className="text-gray-500 mb-6">The restaurant you're looking for doesn't exist</p>
        <button 
          onClick={() => navigate('/restaurants')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  const restaurant = currentRestaurant;
  
  // Debug: Log the restaurant data structure
  console.log('🔍 [RestaurantDetails] Restaurant data:', restaurant);
  console.log('🔍 [RestaurantDetails] Bank fields:', {
    bankName: restaurant.bankDetails?.bankName,
    bankBranch: restaurant.bankDetails?.bankBranch,
    accountNumber: restaurant.bankDetails?.accountNumber,
    accountHolder: restaurant.bankDetails?.accountHolder,
    ifscCode: restaurant.bankDetails?.ifscCode,
    bankPhoneNumber: restaurant.bankDetails?.bankPhoneNumber
  });
  console.log('🔍 [RestaurantDetails] Owner fields:', {
    firstName: restaurant.firstName,
    lastName: restaurant.lastName,
    dateOfBirth: restaurant.dateOfBirth
  });
  console.log('🔍 [RestaurantDetails] Document fields:', {
    profileImage: restaurant.profileImage,
    messImages: restaurant.documents?.messImages,
    qrCode: restaurant.documents?.qrCode,
    passbook: restaurant.documents?.passbook,
    aadharCard: restaurant.documents?.aadharCard,
    panCard: restaurant.documents?.panCard
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
                onClick={() => navigate('/restaurants')}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">{restaurant.businessName}</h1>
                <p className="text-xl text-gray-200 font-medium">Restaurant Details & Management</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusBadge(restaurant.status)}`}>
                {restaurant.status}
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
                onClick={() => openImageModal(getFullImageUrl(restaurant.documents?.profileImage))}
                className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                disabled={!restaurant.documents?.profileImage}
              >
                <img
                  className="w-full h-full object-cover"
                  src={getFullImageUrl(restaurant.documents?.profileImage) || '/default-restaurant.png'}
                  alt={restaurant.businessName}
                  onError={(e) => {
                    console.log('🔍 [RestaurantDetails] Profile image failed to load:', restaurant.documents?.profileImage);
                    console.log('🔍 [RestaurantDetails] Full image URL:', getFullImageUrl(restaurant.documents?.profileImage));
                    e.target.src = '/default-restaurant.png';
                  }}
                  onLoad={() => console.log('🔍 [RestaurantDetails] Profile image loaded successfully:', getFullImageUrl(restaurant.documents?.profileImage))}
                />
              </button>
              <p className="text-sm text-gray-500 mt-2">Click to view larger</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {restaurant.status === 'pending' && (
                <>
                  <button 
                    onClick={handleApprove}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors duration-200 shadow-md"
                  >
                    ✅ Approve Restaurant
                  </button>
                  <button 
                    onClick={() => setShowRejectModal(true)}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md"
                  >
                    ❌ Reject Restaurant
                  </button>
                </>
              )}
              
              {restaurant.status === 'approved' && (
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
                    restaurant.isActive ? '⏸️ Deactivate' : '▶️ Activate'
                  )}
                </button>
              )}
              
              {/* Debug info */}
              <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                <div>Status: {restaurant.status}</div>
                <div>isActive: {String(restaurant.isActive)}</div>
                <div>isApproved: {String(restaurant.isApproved)}</div>
                <div>ID: {restaurant._id || restaurant.id}</div>
                <div>Profile Image: {restaurant.documents?.profileImage || 'Not found'}</div>
                <div>Full Image URL: {getFullImageUrl(restaurant.documents?.profileImage) || 'Not available'}</div>
                <div>Image Path: {restaurant.documents?.profileImage ? '✅ Available' : '❌ Missing'}</div>
                <div>Documents Object: {restaurant.documents ? '✅ Exists' : '❌ Missing'}</div>
                <div>Documents Keys: {restaurant.documents ? Object.keys(restaurant.documents).join(', ') : 'None'}</div>
              </div>
              
              {/* Test button */}
              <button 
                onClick={() => {
                  console.log('🔍 [RestaurantDetails] Test button clicked');
                  console.log('🔍 [RestaurantDetails] Restaurant object:', restaurant);
                  console.log('🔍 [RestaurantDetails] Restaurant keys:', Object.keys(restaurant));
                  console.log('🔍 [RestaurantDetails] Restaurant isActive type:', typeof restaurant.isActive);
                  console.log('🔍 [RestaurantDetails] Restaurant isActive value:', restaurant.isActive);
                }}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-md"
              >
                🔍 Debug Info
              </button>
            </div>
          </div>

          {/* Restaurant-Specific Management */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Restaurant Management</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate(`/restaurants/${id}/plans`)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
              >
                📋 View Meal Plans
              </button>
              <button 
                onClick={() => navigate(`/restaurants/${id}/offers`)}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-md"
              >
                🎯 View Offers
              </button>
              <button 
                onClick={() => navigate(`/restaurants/${id}/items`)}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md"
              >
                🍽️ View Menu Items
              </button>
              <button 
                onClick={() => navigate(`/restaurants/${id}/categories`)}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-md"
              >
                📂 View Categories
              </button>
              <button 
                onClick={() => navigate(`/restaurants/${id}/reviews`)}
                className="w-full px-4 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors duration-200 shadow-md"
              >
                ⭐ View Reviews
              </button>
              <button 
                onClick={() => navigate(`/restaurants/${id}/orders`)}
                className="w-full px-4 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors duration-200 shadow-md"
              >
                📦 View Orders
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                <p className="text-gray-900 font-medium">{restaurant.businessName}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <p className="text-gray-900 font-medium">{restaurant.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <p className="text-gray-900 font-medium">{restaurant.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <p className="text-gray-900 font-medium">{restaurant.category}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                <p className="text-gray-900 font-medium">{restaurant.specialization || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(restaurant.status)}`}>
                  {restaurant.status}
                </span>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <p className="text-gray-900 font-medium">{restaurant.firstName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <p className="text-gray-900 font-medium">{restaurant.lastName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <p className="text-gray-900">
                  {restaurant.dateOfBirth ? new Date(restaurant.dateOfBirth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">OTP Verification</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${restaurant.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {restaurant.isVerified ? '✅ Verified' : '❌ Not Verified'}
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
                <p className="text-gray-900">{restaurant.address}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <p className="text-gray-900">{restaurant.city}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <p className="text-gray-900">{restaurant.state}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Code</label>
                <p className="text-gray-900">{restaurant.pinCode}</p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Bank Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                <p className="text-gray-900">{restaurant.bankDetails?.bankName || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Branch</label>
                <p className="text-gray-900">{restaurant.bankDetails?.bankBranch || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                <p className="text-gray-900 font-mono">{restaurant.bankDetails?.accountNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder</label>
                <p className="text-gray-900">{restaurant.bankDetails?.accountHolder || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                <p className="text-gray-900 font-mono">{restaurant.bankDetails?.ifscCode || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Phone</label>
                <p className="text-gray-900">{restaurant.bankDetails?.bankPhoneNumber || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Date</label>
                <p className="text-gray-900">{new Date(restaurant.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Login</label>
                <p className="text-gray-900">{restaurant.lastLogin ? new Date(restaurant.lastLogin).toLocaleDateString() : 'Never'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Completed</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${restaurant.isProfile ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {restaurant.isProfile ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${restaurant.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {restaurant.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Approval Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${restaurant.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {restaurant.isApproved ? '✅ Approved' : '⏳ Pending'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${restaurant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {restaurant.isActive ? '✅ Active' : '❌ Inactive'}
                </span>
              </div>
              {restaurant.approvedAt && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Approved On</label>
                  <p className="text-gray-900">{new Date(restaurant.approvedAt).toLocaleDateString()}</p>
                </div>
              )}
              {restaurant.updatedAt && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                  <p className="text-gray-900">{new Date(restaurant.updatedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents & Images */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Documents & Images</h3>
            
                         {/* Mess Images */}
            {restaurant.documents?.messImages && restaurant.documents.messImages.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Mess Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {restaurant.documents.messImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => openImageModal(getFullImageUrl(image))}
                      className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 hover:scale-105 transition-transform duration-200 cursor-pointer"
                    >
                      <img
                        src={getFullImageUrl(image)}
                        alt={`Mess ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('🔍 [RestaurantDetails] Mess image failed to load:', image);
                          console.log('🔍 [RestaurantDetails] Full mess image URL:', getFullImageUrl(image));
                          e.target.src = '/default-mess.png';
                        }}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Click to view larger</p>
              </div>
            )}

             {/* Document Links */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {restaurant.documents?.qrCode && (
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">QR Code</label>
                   <button
                     onClick={() => openImageModal(getFullImageUrl(restaurant.documents.qrCode))}
                     className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                   >
                     🔗 View QR Code
                   </button>
                 </div>
               )}
               {restaurant.documents?.passbook && (
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Passbook</label>
                   <button
                     onClick={() => openImageModal(getFullImageUrl(restaurant.documents.passbook))}
                     className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors cursor-pointer"
                   >
                     📄 View Passbook
                   </button>
                 </div>
               )}
               {restaurant.documents?.aadharCard && (
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Card</label>
                   <button
                     onClick={() => openImageModal(getFullImageUrl(restaurant.documents.aadharCard))}
                     className="inline-flex items-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer"
                   >
                     🆔 View Aadhar
                   </button>
                 </div>
               )}
               {restaurant.documents?.panCard && (
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Card</label>
                   <button
                     onClick={() => openImageModal(getFullImageUrl(restaurant.documents.panCard))}
                     className="inline-flex items-center px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer"
                   >
                     🆔 View PAN
                   </button>
                 </div>
               )}
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
                    alt="Restaurant Profile"
                    onError={(e) => {
                      console.log('🔍 [RestaurantDetails] Modal image failed to load:', selectedImage);
                      e.target.src = '/default-restaurant.png';
                    }}
                    onLoad={() => console.log('🔍 [RestaurantDetails] Modal image loaded successfully:', selectedImage)}
                  />
                </div>
                
                {/* Image Info */}
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Profile Image</h3>
                  <p className="text-gray-600">Click outside or press ESC to close</p>
                  <p className="text-xs text-gray-500 mt-2">Image URL: {selectedImage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-8 border w-full max-w-md shadow-2xl rounded-3xl bg-white">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">❌</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Reject Restaurant</h3>
              <p className="text-gray-600 mb-6">
                Please provide a reason for rejecting <span className="font-semibold text-gray-900">{restaurant.businessName}</span>
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                rows="4"
                minLength="10"
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectionReason.trim().length < 10}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Reject Restaurant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
