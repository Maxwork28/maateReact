import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService, ADMIN_CATEGORY_DETAILS, ADMIN_CATEGORY_TOGGLE_STATUS } from '../../../utils/apiUtils';

const CategoryDetails = () => {
  console.log('🔍 [CategoryDetails] Component function called');
  const { id, categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🔍 [CategoryDetails] Component rendered with:', { id, categoryId });

  const fetchCategoryDetails = useCallback(async () => {
    if (!categoryId || categoryId === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [CategoryDetails] Fetching category details for categoryId:', categoryId);
      const response = await apiService.get(ADMIN_CATEGORY_DETAILS(categoryId));
      console.log('🔍 [CategoryDetails] API Response:', response);

      // Handle different response structures
      let categoryData = null;
      if (response && response.data) {
        categoryData = response.data.data || response.data;
      } else if (response) {
        categoryData = response;
      }

      if (!categoryData) {
        throw new Error('No category data found in response');
      }

      console.log('🔍 [CategoryDetails] Extracted category data:', categoryData);
      setCategory(categoryData);
    } catch (error) {
      console.error('❌ [CategoryDetails] Error fetching category details:', error);
      setError(error.message || 'Failed to fetch category details');
      toast.error(error.message || 'Failed to fetch category details');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    console.log('🔍 [CategoryDetails] useEffect triggered with:', { categoryId, id });
    fetchCategoryDetails();
  }, [fetchCategoryDetails, categoryId, id]);

  const handleToggleStatus = async () => {
    try {
      await apiService.put(ADMIN_CATEGORY_TOGGLE_STATUS(categoryId));
      toast.success('Category status updated successfully');
      fetchCategoryDetails(); // Refresh the data
    } catch (error) {
      console.error('❌ [CategoryDetails] Error toggling category status:', error);
      toast.error('Failed to update category status');
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

  if (!categoryId || categoryId === 'undefined') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Invalid Category ID</div>
        <p className="text-gray-500 mb-6">The category ID is missing or invalid</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/categories`)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading category details...</div>
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
            onClick={fetchCategoryDetails}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-lg"
          >
            Retry
          </button>
          <button
            onClick={() => navigate(`/restaurants/${id}/categories`)}
            className="mt-4 ml-4 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📂</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Category not found</div>
        <p className="text-gray-500 mb-6">The category you're looking for doesn't exist</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/categories`)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/restaurants/${id}/categories`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">{category.name || 'Unnamed Category'}</h1>
                <p className="text-xl text-indigo-200 font-medium">Category Details & Management</p>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(category.isActive)}
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
                {category.isActive ? '⏸️ Deactivate Category' : '▶️ Activate Category'}
              </button>
              <button
                onClick={() => navigate(`/restaurants/${id}/items?category=${categoryId}`)}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-md"
              >
                🍽️ View Items in Category
              </button>
            </div>
          </div>

          {/* Restaurant Information */}
          {category.restaurant && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Restaurant Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                  <p className="text-gray-900 font-medium">{category.restaurant.businessName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{category.restaurant.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{category.restaurant.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">
                    {(category.restaurant.city || category.restaurant.state)
                      ? `${category.restaurant.city || ''}, ${category.restaurant.state || ''}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Category Image */}
          {category.image && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Category Image</h3>
              <div className="text-center">
                <div className="w-full h-48 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
                  <img
                    className="w-full h-full object-cover"
                    src={category.image}
                    alt={category.name}
                    onError={(e) => {
                      e.target.src = '/default-category.png';
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Category visual representation</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Category Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                <p className="text-gray-900 font-medium">{category.name || 'Unnamed Category'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                {getStatusBadge(category.isActive)}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Created Date</label>
                <p className="text-gray-900">
                  {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                <p className="text-gray-900">
                  {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Items</label>
                <p className="text-2xl font-bold text-indigo-600">{category.itemCount || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category ID</label>
                <p className="text-gray-900 font-mono text-sm">{category._id}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Description</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-900 leading-relaxed">
                {category.description || 'No description available for this category.'}
              </p>
            </div>
          </div>

          {/* Top Items in Category */}
          {category.topItems && category.topItems.length > 0 ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Items in Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.topItems.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <span className="text-lg font-bold text-indigo-600">₹{item.price || 0}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description || 'No description'}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>⭐ {item.rating || 'No ratings'}</span>
                      <span>📦 {item.totalOrder || 0} orders</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Items in Category</h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍽️</span>
                </div>
                <p className="text-gray-500">No items available in this category yet.</p>
              </div>
            </div>
          )}

          {/* Category Statistics */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Category Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-indigo-600">📊</span>
                </div>
                <p className="text-2xl font-bold text-indigo-600">{category.itemCount || 0}</p>
                <p className="text-gray-600">Total Items</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-green-600">✅</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {category.isActive ? 'Active' : 'Inactive'}
                </p>
                <p className="text-gray-600">Status</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-purple-600">📅</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-gray-600">Created On</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
