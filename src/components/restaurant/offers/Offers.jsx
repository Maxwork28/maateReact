import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_OFFERS } from '../../../utils/apiUtils';

const Offers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, [id]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      console.log('🔍 [Offers] Fetching offers for restaurant:', id);
      const response = await api.get(`${ADMIN_OFFERS}?restaurantId=${id}`);
      console.log('🔍 [Offers] API Response:', response);
      
      // Handle different response structures
      let offersData = [];
      if (response && response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          offersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          offersData = response.data;
        }
      } else if (response && Array.isArray(response)) {
        offersData = response;
      }
      
      console.log('🔍 [Offers] Extracted offers data:', offersData);
      setOffers(offersData);
    } catch (err) {
      console.error('❌ [Offers] Error fetching offers:', err);
      setError(err.message || 'Failed to fetch offers');
      toast.error('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (offerId, currentStatus) => {
    try {
      console.log('🔍 [Offers] Toggling offer status for ID:', offerId);
      console.log('🔍 [Offers] Current status:', currentStatus);
      
      const response = await api.put(`${ADMIN_OFFERS}/${offerId}/toggle-status`);
      console.log('🔍 [Offers] Toggle response:', response);
      
      toast.success('Offer status updated successfully');
      fetchOffers(); // Refresh the list
    } catch (err) {
      console.error('❌ [Offers] Error toggling offer status:', err);
      toast.error('Failed to update offer status');
    }
  };

  const getOfferStatus = (startDate, endDate) => {
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
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading offers...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Offers</div>
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
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
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
                <h1 className="text-4xl font-bold tracking-tight mb-2">Offers</h1>
                <p className="text-xl text-purple-200 font-medium">Restaurant ID: {id}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {Array.isArray(offers) ? offers.length : 0} Offers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Offers</h2>
          <button
            onClick={fetchOffers}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200"
          >
            🔄 Refresh
          </button>
        </div>

        {!Array.isArray(offers) || offers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎯</span>
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-4">
              {!Array.isArray(offers) ? 'Error Loading Offers' : 'No Offers Found'}
            </div>
            <p className="text-gray-500">
              {!Array.isArray(offers) 
                ? 'There was an issue loading the offers. Please try refreshing.' 
                : 'This restaurant hasn\'t created any offers yet.'
              }
            </p>
            {!Array.isArray(offers) && (
              <button 
                onClick={fetchOffers}
                className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200"
              >
                🔄 Retry
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const offerStatus = getOfferStatus(offer.startDate, offer.endDate);
              console.log('🔍 [Offers] Rendering offer:', offer);
              console.log('🔍 [Offers] Offer isValid:', offer.isValid);
              console.log('🔍 [Offers] Offer status:', offerStatus);
              return (
                <div key={offer._id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{offer.offerTitle}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${offerStatus.color}`}>
                      {offerStatus.text}
                    </span>
                  </div>
                  
                  {/* Offer Image */}
                  {offer.offerImage && (
                    <div className="mb-4">
                      <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={offer.offerImage}
                          alt={offer.offerTitle}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/default-offer.png';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Discount Amount</label>
                      <p className="text-2xl font-bold text-purple-600">₹{offer.discountAmount || 0}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Start Date</label>
                      <p className="text-gray-900">{formatDate(offer.startDate)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">End Date</label>
                      <p className="text-gray-900">{formatDate(offer.endDate)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Created</label>
                      <p className="text-gray-900 text-sm">{formatDate(offer.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStatus(offer._id, offer.isValid)}
                      className={`flex-1 px-3 py-2 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                        offer.isValid
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      disabled={offerStatus.status === 'expired'}
                    >
                      {offer.isValid ? '⏸️ Deactivate' : '▶️ Activate'}
                    </button>
                    <button
                      onClick={() => navigate(`/restaurants/${id}/offers/${offer._id}`)}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
