import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_OFFER_DETAILS, ADMIN_OFFER_TOGGLE_STATUS } from '../../../utils/apiUtils';

const OfferDetails = () => {
  console.log('🔍 [OfferDetails] Component function called');
  const { id, offerId } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🔍 [OfferDetails] Component rendered with:', { id, offerId });

  const fetchOfferDetails = useCallback(async () => {
    if (!offerId || offerId === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [OfferDetails] Fetching offer details for offerId:', offerId);
      const response = await api.get(ADMIN_OFFER_DETAILS(offerId));
      console.log('🔍 [OfferDetails] API Response:', response);

      // Handle different response structures
      let offerData = null;
      if (response && response.data) {
        offerData = response.data.data || response.data;
      } else if (response) {
        offerData = response;
      }

      if (!offerData) {
        throw new Error('No offer data found in response');
      }

      console.log('🔍 [OfferDetails] Extracted offer data:', offerData);
      
      // Ensure the data has the expected structure
      if (offerData && typeof offerData === 'object') {
        // Log the structure for debugging
        console.log('🔍 [OfferDetails] Data structure:', {
          hasRestaurantId: !!offerData.restaurantId,
          restaurantIdType: typeof offerData.restaurantId,
          restaurantIdKeys: offerData.restaurantId ? Object.keys(offerData.restaurantId) : 'N/A'
        });
      }
      
      setOffer(offerData);
    } catch (error) {
      console.error('❌ [OfferDetails] Error fetching offer details:', error);
      setError(error.message || 'Failed to fetch offer details');
      toast.error(error.message || 'Failed to fetch offer details');
    } finally {
      setLoading(false);
    }
  }, [offerId]);

  useEffect(() => {
    console.log('🔍 [OfferDetails] useEffect triggered with:', { offerId, id });
    fetchOfferDetails();
  }, [fetchOfferDetails, offerId, id]);

  const handleToggleStatus = async () => {
    try {
      console.log('🔍 [OfferDetails] Toggling offer status for ID:', offerId);
      console.log('🔍 [OfferDetails] Current offer data:', offer);
      
      const response = await api.put(ADMIN_OFFER_TOGGLE_STATUS(offerId));
      console.log('🔍 [OfferDetails] Toggle response:', response);
      
      toast.success('Offer status updated successfully');
      fetchOfferDetails(); // Refresh the data
    } catch (error) {
      console.error('❌ [OfferDetails] Error toggling offer status:', error);
      toast.error('Failed to update offer status');
    }
  };

  const getOfferStatus = (startDate, endDate) => {
    try {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (now < start) {
        return { status: 'upcoming', text: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
      } else if (now >= start && now <= end) {
        return { status: 'active', text: 'Active', color: 'bg-green-100 text-green-800' };
      } else {
        return { status: 'expired', text: 'Expired', color: 'bg-red-100 text-red-800' };
      }
    } catch (error) {
      console.error('❌ [OfferDetails] Error calculating offer status:', error);
      return { status: 'unknown', text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('❌ [OfferDetails] Error formatting date:', error, 'dateString:', dateString);
      return 'Invalid Date';
    }
  };

  const getTimeRemaining = (endDate) => {
    try {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end - now;
      
      if (diff <= 0) return 'Expired';
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) return `${days}d ${hours}h remaining`;
      if (hours > 0) return `${hours}h ${minutes}m remaining`;
      return `${minutes}m remaining`;
    } catch (error) {
      console.error('❌ [OfferDetails] Error calculating time remaining:', error);
      return 'Unknown';
    }
  };

  if (!offerId || offerId === 'undefined') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Invalid Offer ID</div>
        <p className="text-gray-500 mb-6">The offer ID is missing or invalid</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/offers`)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Offers
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading offer details...</div>
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
            onClick={fetchOfferDetails}
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-lg"
          >
            Retry
          </button>
          <button
            onClick={() => navigate(`/restaurants/${id}/offers`)}
            className="mt-4 ml-4 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
          >
            Back to Offers
          </button>
        </div>
      </div>
    );
  }

  if (!offer || typeof offer !== 'object') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎯</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Offer not found</div>
        <p className="text-gray-500 mb-6">The offer you're looking for doesn't exist or has invalid data</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/offers`)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Offers
        </button>
      </div>
    );
  }

  const offerStatus = getOfferStatus(offer.startDate, offer.endDate);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/restaurants/${id}/offers`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">{offer.offerTitle || 'Unnamed Offer'}</h1>
                <p className="text-xl text-purple-200 font-medium">Offer Details & Management</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${offerStatus.color}`}>
                {offerStatus.text}
              </span>
              <p className="text-2xl font-bold mt-2">₹{offer.discountAmount || 0}</p>
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
                disabled={offerStatus.status === 'expired'}
              >
                {offer.isValid ? '⏸️ Deactivate Offer' : '▶️ Activate Offer'}
              </button>
              <button
                onClick={() => navigate(`/restaurants/${id}/offers`)}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-md"
              >
                📋 Back to Offers
              </button>
              
              {/* Debug info */}
              <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                <div>Offer ID: {offer._id}</div>
                <div>isValid: {String(offer.isValid)}</div>
                <div>Status: {offerStatus.status}</div>
                <div>Status Text: {offerStatus.text}</div>
                <div>Offer Keys: {Object.keys(offer).join(', ')}</div>
              </div>
            </div>
          </div>

          {/* Restaurant Information */}
          {offer.restaurantId && typeof offer.restaurantId === 'object' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Restaurant Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                  <p className="text-gray-900 font-medium">{offer.restaurantId.businessName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{offer.restaurantId.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{offer.restaurantId.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">
                    {(offer.restaurantId.city || offer.restaurantId.state)
                      ? `${offer.restaurantId.city || ''}, ${offer.restaurantId.state || ''}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Offer Image */}
          {offer.offerImage && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Offer Image</h3>
              <div className="text-center">
                <div className="w-full h-48 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
                  <img
                    className="w-full h-full object-cover"
                    src={offer.offerImage}
                    alt={offer.offerTitle}
                    onError={(e) => {
                      e.target.src = '/default-offer.png';
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Offer visual representation</p>
              </div>
            </div>
          )}

          {/* Time Remaining */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Time Remaining</h3>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⏰</span>
              </div>
              <p className="text-lg font-bold text-purple-600">
                {getTimeRemaining(offer.endDate)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Until offer expires</p>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Offer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Title</label>
                <p className="text-gray-900 font-medium">{offer.offerTitle || 'Unnamed Offer'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${offerStatus.color}`}>
                  {offerStatus.text}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Amount</label>
                <p className="text-3xl font-bold text-purple-600">₹{offer.discountAmount || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Offer ID</label>
                <p className="text-gray-900 font-mono text-sm">{offer._id}</p>
              </div>
            </div>
          </div>

          {/* Validity Period */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Validity Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-blue-900 font-medium">{formatDate(offer.startDate)}</p>
                  <p className="text-blue-600 text-sm">Offer begins</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-red-900 font-medium">{formatDate(offer.endDate)}</p>
                  <p className="text-red-600 text-sm">Offer expires</p>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Statistics */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Offer Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-purple-600">💰</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">₹{offer.discountAmount || 0}</p>
                <p className="text-gray-600">Discount Value</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-green-600">✅</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {offerStatus.status === 'active' ? 'Active' : offerStatus.status}
                </p>
                <p className="text-gray-600">Current Status</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-blue-600">📅</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-gray-600">Created On</p>
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
                  {offer.createdAt ? formatDate(offer.createdAt) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                <p className="text-gray-900">
                  {offer.updatedAt ? formatDate(offer.updatedAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Restaurant ID</label>
                <p className="text-gray-900 font-mono text-sm">
                  {typeof offer.restaurantId === 'object' && offer.restaurantId._id 
                    ? offer.restaurantId._id 
                    : (typeof offer.restaurantId === 'string' ? offer.restaurantId : 'N/A')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Version</label>
                <p className="text-gray-900">v{offer.__v || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
