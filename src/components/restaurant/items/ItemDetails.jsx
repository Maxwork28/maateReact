import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService, ADMIN_ITEM_DETAILS, ADMIN_ITEM_TOGGLE_STATUS, ADMIN_ITEM_AVAILABILITY } from '../../../utils/apiUtils';

const ItemDetails = () => {
  console.log('🔍 [ItemDetails] Component function called');
  const { id, itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🔍 [ItemDetails] Component rendered with:', { id, itemId });

  const fetchItemDetails = useCallback(async () => {
    if (!itemId || itemId === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [ItemDetails] Fetching item details for itemId:', itemId);
      const response = await apiService.get(ADMIN_ITEM_DETAILS(itemId));
      console.log('🔍 [ItemDetails] API Response:', response);

      // Handle different response structures
      let itemData = null;
      if (response && response.data) {
        itemData = response.data.data || response.data;
      } else if (response) {
        itemData = response;
      }

      if (!itemData) {
        throw new Error('No item data found in response');
      }

      console.log('🔍 [ItemDetails] Extracted item data:', itemData);
      setItem(itemData);
    } catch (error) {
      console.error('❌ [ItemDetails] Error fetching item details:', error);
      setError(error.message || 'Failed to fetch item details');
      toast.error(error.message || 'Failed to fetch item details');
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    console.log('🔍 [ItemDetails] useEffect triggered with:', { itemId, id });
    fetchItemDetails();
  }, [fetchItemDetails, itemId, id]);

  const handleToggleStatus = async () => {
    try {
      await apiService.put(ADMIN_ITEM_TOGGLE_STATUS(itemId));
      toast.success('Item status updated successfully');
      fetchItemDetails(); // Refresh the data
    } catch (error) {
      console.error('❌ [ItemDetails] Error toggling item status:', error);
      toast.error('Failed to update item status');
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const newAvailability = item.availability === 'available' ? 'limited' : 'available';
      await apiService.put(ADMIN_ITEM_AVAILABILITY(itemId), { availability: newAvailability });
      toast.success('Item availability updated successfully');
      fetchItemDetails(); // Refresh the data
    } catch (error) {
      console.error('❌ [ItemDetails] Error toggling item availability:', error);
      toast.error('Failed to update item availability');
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

  const getAvailabilityBadge = (availability) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'limited':
        return 'Limited';
      case 'out_of_stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  if (!itemId || itemId === 'undefined') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Invalid Item ID</div>
        <p className="text-gray-500 mb-6">The item ID is missing or invalid</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/items`)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Items
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading item details...</div>
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
            onClick={fetchItemDetails}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg"
          >
            Retry
          </button>
          <button
            onClick={() => navigate(`/restaurants/${id}/items`)}
            className="mt-4 ml-4 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
          >
            Back to Items
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🍽️</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Item not found</div>
        <p className="text-gray-500 mb-6">The item you're looking for doesn't exist</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/items`)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Items
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-emerald-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/restaurants/${id}/items`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">{item.name || 'Unnamed Item'}</h1>
                <p className="text-xl text-green-200 font-medium">Menu Item Details & Management</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex space-x-2 mb-2">
                {getStatusBadge(item.isActive)}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityBadge(item.availability)}`}>
                  {getAvailabilityText(item.availability)}
                </span>
              </div>
              <p className="text-2xl font-bold">₹{item.price || 0}</p>
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
                {item.isActive ? '⏸️ Deactivate Item' : '▶️ Activate Item'}
              </button>
              <button
                onClick={handleToggleAvailability}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
              >
                🔄 Toggle Availability
              </button>
            </div>
          </div>

          {/* Restaurant Information */}
          {item.restaurant && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Restaurant Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                  <p className="text-gray-900 font-medium">{item.restaurant.businessName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{item.restaurant.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{item.restaurant.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">
                    {(item.restaurant.city || item.restaurant.state)
                      ? `${item.restaurant.city || ''}, ${item.restaurant.state || ''}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Category Information */}
          {item.category && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Category Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name</label>
                  <p className="text-gray-900 font-medium">{item.category.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category Type</label>
                  <p className="text-gray-900">{item.itemCategory || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Item Image */}
          {item.image && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Item Image</h3>
              <div className="text-center">
                <div className="w-full h-48 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/default-item.png';
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Item visual representation</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Item Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                <p className="text-gray-900 font-medium">{item.name || 'Unnamed Item'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                <p className="text-3xl font-bold text-green-600">₹{item.price || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                {getStatusBadge(item.isActive)}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getAvailabilityBadge(item.availability)}`}>
                  {getAvailabilityText(item.availability)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <p className="text-gray-900">{item.itemCategory || 'Uncategorized'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Diet Meal</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.isDietMeal ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {item.isDietMeal ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
                <p className="text-gray-900">🔥 {item.calories || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item ID</label>
                <p className="text-gray-900 font-mono text-sm">{item._id}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Description</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-900 leading-relaxed">
                {item.description || 'No description available for this item.'}
              </p>
            </div>
          </div>

          {/* Ratings & Reviews */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ratings & Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-yellow-600">⭐</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{item.rating || 'No ratings'}</p>
                <p className="text-gray-600">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-blue-600">📝</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{item.totalRatings || 0}</p>
                <p className="text-gray-600">Total Ratings</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-green-600">📊</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{item.totalReviews || 0}</p>
                <p className="text-gray-600">Total Reviews</p>
              </div>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-purple-600">📦</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{item.totalOrder || 0}</p>
                <p className="text-gray-600">Total Orders</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-indigo-600">💰</span>
                </div>
                <p className="text-2xl font-bold text-indigo-600">₹{(item.totalOrder || 0) * (item.price || 0)}</p>
                <p className="text-gray-600">Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Created Date</label>
                <p className="text-gray-900">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                <p className="text-gray-900">
                  {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
