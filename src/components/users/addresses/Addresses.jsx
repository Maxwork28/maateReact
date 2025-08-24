import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_USER_ADDRESSES } from '../../../utils/apiUtils';

const Addresses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, [id]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      console.log('🔍 [Addresses] Fetching addresses for user:', id);
      const response = await api.get(ADMIN_USER_ADDRESSES(id));
      console.log('🔍 [Addresses] API Response:', response);
      
      // Handle different response structures
      let addressesData = [];
      if (response && response.data) {
        // Check if response.data has a nested 'data' property (API response structure)
        if (response.data.data && Array.isArray(response.data.data)) {
          addressesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          addressesData = response.data;
        }
      } else if (response && Array.isArray(response)) {
        addressesData = response;
      }
      
      console.log('🔍 [Addresses] Extracted addresses data:', addressesData);
      setAddresses(addressesData);
    } catch (err) {
      console.error('❌ [Addresses] Error fetching addresses:', err);
      setError(err.message || 'Failed to fetch addresses');
      toast.error('Failed to fetch user addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (addressId, currentStatus) => {
    try {
      await api.put(`${ADMIN_USER_ADDRESSES(id)}/${addressId}/toggle-status`);
      toast.success('Address status updated successfully');
      fetchAddresses(); // Refresh the list
    } catch (err) {
      toast.error('Failed to update address status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading user addresses...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Addresses</div>
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
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
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
                <h1 className="text-3xl font-bold">User Addresses</h1>
                <p className="text-blue-100">Manage and monitor user addresses</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{addresses.length}</div>
              <div className="text-blue-100">Total Addresses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Addresses List */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Address List</h2>
          <p className="text-gray-600 mt-1">All addresses associated with this user</p>
        </div>
        
        {addresses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Addresses Found</h3>
            <p className="text-gray-500">This user hasn't added any addresses yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {addresses.map((address, index) => (
              <div key={address._id || index} className={`p-6 hover:bg-gray-50 transition-all duration-200 border-l-4 ${
                address.isDefault ? 'border-l-blue-500 bg-blue-50' : 'border-l-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {address.type === 'home' ? '🏠' : 
                         address.type === 'work' ? '🏢' : 
                         address.type === 'other' ? '📍' : 
                         address.type ? address.type.charAt(0).toUpperCase() : '🏠'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {address.fullAddress || 'No address'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.pincode}
                      </p>
                      <p className="text-xs text-gray-500">
                        Type: {address.type ? address.type.charAt(0).toUpperCase() + address.type.slice(1) : 'Home'}
                        {address.isDefault && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Default</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Added: {address.createdAt ? new Date(address.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Status Badge */}
                    <div className="text-center">
                      {address.isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Active</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">Inactive</span>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleStatus(address._id, address.isActive)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          address.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {address.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => navigate(`/users/${id}/addresses/${address._id}`)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                      >
                        View
                      </button>
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

export default Addresses;
