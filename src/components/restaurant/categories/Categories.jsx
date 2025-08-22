import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService, ADMIN_CATEGORIES } from '../../../utils/apiUtils';

const Categories = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [id]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('🔍 [Categories] Fetching categories for restaurant:', id);
      const response = await apiService.get(`${ADMIN_CATEGORIES}?restaurant=${id}`);
      console.log('🔍 [Categories] API Response:', response);
      
      // Handle different response structures
      let categoriesData = [];
      if (response && response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          categoriesData = response.data;
        }
      } else if (response && Array.isArray(response)) {
        categoriesData = response;
      }
      
      console.log('🔍 [Categories] Extracted categories data:', categoriesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('❌ [Categories] Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (categoryId, currentStatus) => {
    try {
      await apiService.put(`${ADMIN_CATEGORIES}/${categoryId}/toggle-status`);
      toast.success('Category status updated successfully');
      fetchCategories(); // Refresh the list
    } catch (err) {
      toast.error('Failed to update category status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading categories...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Categories</div>
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
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
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
                <h1 className="text-4xl font-bold tracking-tight mb-2">Categories</h1>
                <p className="text-xl text-indigo-200 font-medium">Restaurant ID: {id}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {Array.isArray(categories) ? categories.length : 0} Categories
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Categories</h2>
          <button
            onClick={fetchCategories}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200"
          >
            🔄 Refresh
          </button>
        </div>

        {!Array.isArray(categories) || categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📂</span>
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-4">
              {!Array.isArray(categories) ? 'Error Loading Categories' : 'No Categories Found'}
            </div>
            <p className="text-gray-500">
              {!Array.isArray(categories) 
                ? 'There was an issue loading the categories. Please try refreshing.' 
                : 'This restaurant hasn\'t created any categories yet.'
              }
            </p>
            {!Array.isArray(categories) && (
              <button 
                onClick={fetchCategories}
                className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200"
              >
                🔄 Retry
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category._id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Description</label>
                    <p className="text-gray-900 text-sm">{category.description || 'No description available'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Item Count</label>
                    <p className="text-gray-900">{category.itemCount || 0} items</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Created</label>
                    <p className="text-gray-900 text-sm">
                      {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Category Image */}
                {category.image && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                    <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/default-category.png';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStatus(category._id, category.isActive)}
                    className={`flex-1 px-3 py-2 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                      category.isActive
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {category.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => navigate(`/restaurants/${id}/items?category=${category._id}`)}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors duration-200"
                  >
                    View Items
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

export default Categories;
