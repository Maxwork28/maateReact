import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_USER_ADDRESSES } from '../../../utils/apiUtils';

const AddressDetails = () => {
  console.log('🔍 [AddressDetails] Component function called');
  const { id, addressId } = useParams();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🔍 [AddressDetails] Component rendered with:', { id, addressId });

  const fetchAddressDetails = useCallback(async () => {
    if (!addressId || addressId === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [AddressDetails] Fetching address details for addressId:', addressId);
      const response = await api.get(`${ADMIN_USER_ADDRESSES(id)}/${addressId}`);
      console.log('🔍 [AddressDetails] API Response:', response);

      // Handle different response structures
      let addressData = null;
      if (response && response.data) {
        addressData = response.data.data || response.data;
      } else if (response) {
        addressData = response;
      }

      if (!addressData) {
        throw new Error('No address data found in response');
      }

      console.log('🔍 [AddressDetails] Extracted address data:', addressData);
      setAddress(addressData);
    } catch (error) {
      console.error('❌ [AddressDetails] Error fetching address details:', error);
      setError(error.message || 'Failed to fetch address details');
      toast.error(error.message || 'Failed to fetch address details');
    } finally {
      setLoading(false);
    }
  }, [addressId, id]);

  useEffect(() => {
    console.log('🔍 [AddressDetails] useEffect triggered with:', { addressId, id });
    fetchAddressDetails();
  }, [fetchAddressDetails, addressId, id]);

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

  const getTypeBadge = (type) => {
    const typeConfig = {
      home: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      work: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      other: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
    };

    const config = typeConfig[type?.toLowerCase()] || typeConfig.other;
    
    return (
      <span className={`px-3 py-1 ${config.bg} ${config.text} text-sm font-semibold rounded-full border ${config.border}`}>
        {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Other'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading address details...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Address</div>
          <div className="text-red-600 mb-6">{error}</div>
          <button 
            onClick={() => navigate(`/users/${id}/addresses`)}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Back to Addresses
          </button>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">❌</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Address Not Found</div>
        <p className="text-gray-500 mb-6">The requested address could not be found</p>
        <button 
          onClick={() => navigate(`/users/${id}/addresses`)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Addresses
        </button>
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
                onClick={() => navigate(`/users/${id}/addresses`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold">Address Details</h1>
                <p className="text-blue-100">View detailed information about this address</p>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(address.isActive)}
            </div>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Address Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Address</label>
              <p className="text-lg font-semibold text-gray-800">
                {address.fullAddress || 'No address available'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">City</label>
              <p className="text-lg text-gray-800">
                {address.city || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Pincode</label>
              <p className="text-lg text-gray-800">
                {address.pincode || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Pincode</label>
              <p className="text-lg text-gray-800">
                {address.pincode || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Address Type</label>
              <div className="mt-2">
                {getTypeBadge(address.type)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Default Address</label>
              <div className="mt-2">
                {address.isDefault ? (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-200">
                    Default Address
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full border border-gray-200">
                    Not Default
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Address ID</label>
              <p className="text-sm font-mono text-gray-600 bg-gray-100 p-2 rounded">
                {address._id || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="text-sm font-mono text-gray-600 bg-gray-100 p-2 rounded">
                {id || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Created</label>
              <p className="text-lg text-gray-800">
                {address.createdAt ? new Date(address.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Actions</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(`/users/${id}/addresses`)}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200"
          >
            Back to Addresses
          </button>
          <button
            onClick={() => navigate(`/users/${id}`)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View User Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
