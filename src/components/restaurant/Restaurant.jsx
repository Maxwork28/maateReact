import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRestaurants, approveRestaurant, rejectRestaurant, toggleRestaurantStatus } from '../../store/slices/restaurantsSlice';
import { toast } from 'react-toastify';

const Restaurant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants, loading, error } = useSelector((state) => state.restaurants);
  const [statusFilter, setStatusFilter] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Debug logging
  console.log('Restaurant component - restaurants:', restaurants);
  console.log('Restaurant component - restaurants type:', typeof restaurants);
  console.log('Restaurant component - restaurants isArray:', Array.isArray(restaurants));

  // Ensure restaurants is always an array
  const restaurantsList = Array.isArray(restaurants) ? restaurants : [];
  
  console.log('Restaurant component - restaurantsList:', restaurantsList);

  useEffect(() => {
    console.log('Restaurant component - dispatching fetchRestaurants');
    dispatch(fetchRestaurants({ page: 1, status: statusFilter }));
  }, [dispatch, statusFilter]);

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

  const handleApprove = async (restaurantId) => {
    try {
      console.log('🔍 [Restaurant] handleApprove called with ID:', restaurantId);
      console.log('🔍 [Restaurant] Approving restaurant...');
      
      const result = await dispatch(approveRestaurant(restaurantId)).unwrap();
      console.log('🔍 [Restaurant] Approve result:', result);
      
      toast.success('Restaurant approved successfully');
      dispatch(fetchRestaurants({ page: 1, status: statusFilter }));
    } catch (error) {
      console.error('🔍 [Restaurant] Approve error:', error);
      toast.error(error || 'Failed to approve restaurant');
    }
  };

  const handleReject = async (restaurantId, reason) => {
    try {
      console.log('🔍 [Restaurant] handleReject called with ID:', restaurantId, 'Reason:', reason);
      console.log('🔍 [Restaurant] Rejecting restaurant...');
      
      const result = await dispatch(rejectRestaurant({ restaurantId, reason })).unwrap();
      console.log('🔍 [Restaurant] Reject result:', result);
      
      toast.success('Restaurant rejected successfully');
      setShowRejectModal(false);
      setSelectedRestaurant(null);
      setRejectionReason('');
      dispatch(fetchRestaurants({ page: 1, status: statusFilter }));
    } catch (error) {
      console.error('🔍 [Restaurant] Reject error:', error);
      toast.error(error || 'Failed to reject restaurant');
    }
  };

  const handleToggleStatus = async (restaurantId) => {
    try {
      console.log('🔍 [Restaurant] Toggling status for restaurant ID:', restaurantId);
      console.log('🔍 [Restaurant] Restaurant ID type:', typeof restaurantId);
      console.log('🔍 [Restaurant] Restaurant ID value:', restaurantId);
      
      if (!restaurantId) {
        toast.error('Invalid restaurant ID');
        return;
      }
      
      await dispatch(toggleRestaurantStatus(restaurantId)).unwrap();
      toast.success('Restaurant status updated successfully');
      dispatch(fetchRestaurants({ page: 1, status: statusFilter }));
    } catch (error) {
      console.error('🔍 [Restaurant] Toggle error:', error);
      toast.error(error || 'Failed to update restaurant status');
    }
  };

  const openRejectModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRejectModal(true);
  };

  const openImageModal = (imageUrl, restaurantName) => {
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
          <div className="text-xl font-semibold text-gray-700">Loading restaurants...</div>
          <div className="text-gray-500">Please wait while we fetch the data</div>
        </div>
      </div>
    );
  }

  // Check if we have any data yet
  if (!restaurants && !loading && !error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🏪</span>
          </div>
          <div className="text-xl font-semibold text-gray-700 mb-4">No restaurants data loaded</div>
          <p className="text-gray-500 mb-6">Click the button below to load restaurant data</p>
          <button 
            onClick={() => dispatch(fetchRestaurants({ page: 1, status: statusFilter }))}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Load Restaurants
          </button>
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
            <div className="text-red-600">{error}</div>
          </div>
        </div>
        <button 
          onClick={() => dispatch(fetchRestaurants({ page: 1, status: statusFilter }))}
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
        >
          Try Again
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
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🏪</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Restaurant Management</h1>
              <p className="text-xl text-gray-200 font-medium">Manage and monitor all restaurants on the platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <span>📊</span>
            <span>Total Restaurants: {restaurantsList.length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Filters & Controls</h2>
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <button 
              onClick={() => dispatch(fetchRestaurants({ page: 1, status: statusFilter }))}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg mt-6"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Restaurants List */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Restaurants</h2>
          <div className="text-sm text-gray-500">
            Showing {restaurantsList.length} restaurants
          </div>
        </div>
        
        {restaurantsList.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-2">No restaurants found</div>
            <div className="text-gray-500">Try adjusting your filters or refresh the data</div>
          </div>
        ) : (
          <div className="space-y-6">
            {restaurantsList.map((restaurant) => {
              console.log('🔍 [Restaurant] Restaurant data:', restaurant);
              console.log('🔍 [Restaurant] Restaurant ID:', restaurant._id || restaurant.id);
              console.log('🔍 [Restaurant] Restaurant keys:', Object.keys(restaurant));
              console.log('🔍 [Restaurant] Restaurant documents:', restaurant.documents);
              console.log('🔍 [Restaurant] Restaurant profileImage path:', restaurant.documents?.profileImage);
              console.log('🔍 [Restaurant] Restaurant status:', restaurant.status);
              console.log('🔍 [Restaurant] Restaurant status type:', typeof restaurant.status);
              console.log('🔍 [Restaurant] Status === pending:', restaurant.status === 'pending');
              return (
                <div key={restaurant.id || restaurant._id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-6">
                    {/* Restaurant Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
                        <button
                          onClick={() => openImageModal(restaurant.documents?.profileImage, restaurant.businessName)}
                          className="w-full h-full hover:scale-105 transition-transform duration-200 cursor-pointer"
                          disabled={!restaurant.documents?.profileImage}
                        >
                          <img
                            className="w-full h-full object-cover"
                            src={restaurant.documents?.profileImage || '/default-restaurant.png'}
                            alt={restaurant.businessName}
                            onError={(e) => {
                              console.log('Image failed to load:', restaurant.documents?.profileImage);
                              e.target.src = '/default-restaurant.png';
                            }}
                            onLoad={() => console.log('Image loaded successfully:', restaurant.documents?.profileImage)}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{restaurant.businessName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(restaurant.status)}`}>
                          {restaurant.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Phone:</span> {restaurant.phone}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {restaurant.city}, {restaurant.state}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {restaurant.category}
                        </div>
                        <div>
                          <span className="font-medium">Specialization:</span> {restaurant.specialization}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <div className="flex flex-col space-y-3">
                        <button 
                          onClick={() => navigate(`/restaurants/${restaurant.id || restaurant._id}`)}
                          className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200"
                        >
                          👁️ View Details
                        </button>
                        
                        {restaurant.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => {
                                console.log('🔍 [Restaurant] Approve button clicked for restaurant:', restaurant);
                                const restaurantId = restaurant._id || restaurant.id;
                                console.log('🔍 [Restaurant] Restaurant ID for approval:', restaurantId);
                                
                                if (!restaurantId) {
                                  console.error('🔍 [Restaurant] No restaurant ID found for approval!');
                                  toast.error('Restaurant ID not found');
                                  return;
                                }
                                
                                handleApprove(restaurantId);
                              }}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors duration-200 shadow-md cursor-pointer"
                              style={{ cursor: 'pointer' }}
                            >
                              ✅ Approve
                            </button>
                            <button 
                              onClick={() => {
                                console.log('🔍 [Restaurant] Reject button clicked for restaurant:', restaurant);
                                openRejectModal(restaurant);
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors duration-200 shadow-md cursor-pointer"
                              style={{ cursor: 'pointer' }}
                            >
                              ❌ Reject
                            </button>
                            {/* Test button to verify click functionality */}
                            <button 
                              onClick={() => {
                                console.log('🔍 [Restaurant] Test button clicked!');
                                toast.info('Test button works!');
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors duration-200 shadow-md cursor-pointer"
                              style={{ cursor: 'pointer' }}
                            >
                              🧪 Test Button
                            </button>
                          </>
                        )}
                        
                        {restaurant.status === 'approved' && (
                          <button 
                            onClick={() => {
                              console.log('🔍 [Restaurant] Toggle button clicked for restaurant:', restaurant);
                              console.log('🔍 [Restaurant] Restaurant _id:', restaurant._id);
                              console.log('🔍 [Restaurant] Restaurant id:', restaurant.id);
                              console.log('🔍 [Restaurant] Restaurant keys:', Object.keys(restaurant));
                              console.log('🔍 [Restaurant] Restaurant type:', typeof restaurant);
                              
                              const restaurantId = restaurant._id || restaurant.id;
                              console.log('🔍 [Restaurant] Final restaurant ID to use:', restaurantId);
                              
                              if (!restaurantId) {
                                console.error('🔍 [Restaurant] No restaurant ID found!');
                                toast.error('Restaurant ID not found');
                                return;
                              }
                              
                              handleToggleStatus(restaurantId);
                            }}
                            className="px-4 py-2 bg-orange-600 text-white rounded-xl font-semibold text-sm hover:bg-orange-700 transition-colors duration-200 shadow-md"
                          >
                            {restaurant.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
                      console.log('Modal image failed to load:', selectedImage);
                      e.target.src = '/default-restaurant.png';
                    }}
                  />
                </div>
                
                {/* Image Info */}
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Profile Image</h3>
                  <p className="text-gray-600">Click outside or press ESC to close</p>
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
                Please provide a reason for rejecting <span className="font-semibold text-gray-900">{selectedRestaurant?.businessName}</span>
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
                    setSelectedRestaurant(null);
                    setRejectionReason('');
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const restaurantId = selectedRestaurant._id || selectedRestaurant.id;
                    console.log('🔍 [Restaurant] Rejecting restaurant with ID:', restaurantId);
                    
                    if (!restaurantId) {
                      console.error('🔍 [Restaurant] No restaurant ID found for rejection!');
                      toast.error('Restaurant ID not found');
                      return;
                    }
                    
                    handleReject(restaurantId, rejectionReason);
                  }}
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

export default Restaurant;
