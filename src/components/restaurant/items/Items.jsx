import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService, ADMIN_ITEMS } from '../../../utils/apiUtils';

const Items = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [id, searchParams]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const categoryFilter = searchParams.get('category');
      const queryParams = new URLSearchParams({ restaurant: id });
      if (categoryFilter) {
        queryParams.append('category', categoryFilter);
      }
      
      console.log('🔍 [Items] Fetching items for restaurant:', id, 'category:', categoryFilter);
      const response = await apiService.get(`${ADMIN_ITEMS}?${queryParams}`);
      console.log('🔍 [Items] API Response:', response);
      
      // Handle different response structures
      let itemsData = [];
      if (response && response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          itemsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          itemsData = response.data;
        }
      } else if (response && Array.isArray(response)) {
        itemsData = response;
      }
      
      console.log('🔍 [Items] Extracted items data:', itemsData);
      setItems(itemsData);
    } catch (err) {
      console.error('❌ [Items] Error fetching items:', err);
      setError(err.message || 'Failed to fetch items');
      toast.error('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (itemId, currentStatus) => {
    try {
      await apiService.put(`${ADMIN_ITEMS}/${itemId}/toggle-status`);
      toast.success('Item status updated successfully');
      fetchItems(); // Refresh the list
    } catch (err) {
      toast.error('Failed to update item status');
    }
  };

  const handleToggleAvailability = async (itemId, currentAvailability) => {
    try {
      const newAvailability = currentAvailability === 'available' ? 'limited' : 'available';
      await apiService.put(`${ADMIN_ITEMS}/${itemId}/availability`, { availability: newAvailability });
      toast.success('Item availability updated successfully');
      fetchItems(); // Refresh the list
    } catch (err) {
      toast.error('Failed to update item availability');
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading menu items...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Items</div>
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
      <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
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
                <h1 className="text-4xl font-bold tracking-tight mb-2">Menu Items</h1>
                <p className="text-xl text-green-200 font-medium">Restaurant ID: {id}</p>
                {searchParams.get('category') && (
                  <p className="text-lg text-green-100">Category Filter: {searchParams.get('category')}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {Array.isArray(items) ? items.length : 0} Items
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Menu Items</h2>
          <div className="flex space-x-3">
            {searchParams.get('category') && (
              <button
                onClick={() => navigate(`/restaurants/${id}/items`)}
                className="px-4 py-2 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200"
              >
                🗂️ Clear Filter
              </button>
            )}
            <button
              onClick={fetchItems}
              className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {!Array.isArray(items) || items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🍽️</span>
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-4">
              {!Array.isArray(items) ? 'Error Loading Items' : 'No Menu Items Found'}
            </div>
            <p className="text-gray-500">
              {!Array.isArray(items) 
                ? 'There was an issue loading the menu items. Please try refreshing.' 
                : 'This restaurant hasn\'t created any menu items yet.'
              }
            </p>
            {!Array.isArray(items) && (
              <button 
                onClick={fetchItems}
                className="mt-4 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                🔄 Retry
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {/* Item Image */}
                {item.image && (
                  <div className="mb-4">
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/default-item.png';
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Description</label>
                    <p className="text-gray-900 text-sm">{item.description || 'No description available'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Price</label>
                    <p className="text-2xl font-bold text-green-600">₹{item.price || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Category</label>
                    <p className="text-gray-900">{item.itemCategory || 'Uncategorized'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Availability</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAvailabilityBadge(item.availability)}`}>
                      {getAvailabilityText(item.availability)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Calories</label>
                      <p className="text-gray-900">🔥 {item.calories || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Rating</label>
                      <p className="text-gray-900">⭐ {item.rating || 'No ratings'} ({item.totalRatings || 0})</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Total Orders</label>
                    <p className="text-gray-900">📦 {item.totalOrder || 0}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStatus(item._id, item.isActive)}
                    className={`flex-1 px-3 py-2 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                      item.isActive
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleToggleAvailability(item._id, item.availability)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors duration-200"
                  >
                    Toggle Availability
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

export default Items;

