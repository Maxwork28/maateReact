import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_REVIEWS } from '../../../utils/apiUtils';

const Reviews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log('🔍 [Reviews] Fetching reviews for restaurant:', id);
      const response = await api.get(`${ADMIN_REVIEWS}?restaurant=${id}`);
      console.log('🔍 [Reviews] API Response:', response);
      
      // Handle different response structures
      let reviewsData = [];
      if (response && response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          reviewsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          reviewsData = response.data;
        }
      } else if (response && Array.isArray(response)) {
        reviewsData = response;
      }
      
      console.log('🔍 [Reviews] Extracted reviews data:', reviewsData);
      setReviews(reviewsData);
    } catch (err) {
      console.error('❌ [Reviews] Error fetching reviews:', err);
      setError(err.message || 'Failed to fetch reviews');
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (reviewId, currentVisibility) => {
    try {
      console.log('🔍 [Reviews] Toggling visibility for review:', reviewId);
      console.log('🔍 [Reviews] Current visibility:', currentVisibility);
      const response = await api.put(`${ADMIN_REVIEWS}/${reviewId}/toggle-visibility`);
      console.log('🔍 [Reviews] Toggle response:', response);
      toast.success('Review visibility updated successfully');
      fetchReviews(); // Refresh the list
    } catch (err) {
      console.error('❌ [Reviews] Error toggling visibility:', err);
      toast.error('Failed to update review visibility');
    }
  };

  const handleFlagReview = async (reviewId) => {
    try {
      console.log('🔍 [Reviews] Flagging review:', reviewId);
      // Add a default reason for flagging
      const response = await api.put(`${ADMIN_REVIEWS}/${reviewId}/flag`, {
        reason: 'Review flagged by admin for inappropriate content'
      });
      console.log('🔍 [Reviews] Flag response:', response);
      toast.success('Review flagged successfully');
      fetchReviews(); // Refresh the list
    } catch (err) {
      console.error('❌ [Reviews] Error flagging review:', err);
      toast.error('Failed to flag review');
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('⭐');
      } else {
        stars.push('☆');
      }
    }
    return stars.join('');
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'neutral':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading reviews...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Reviews</div>
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
      <div className="bg-gradient-to-r from-yellow-900 to-yellow-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
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
                <h1 className="text-4xl font-bold tracking-tight mb-2">Reviews</h1>
                <p className="text-xl text-yellow-200 font-medium">Restaurant ID: {id}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {Array.isArray(reviews) ? reviews.length : 0} Reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <button
            onClick={fetchReviews}
            className="px-4 py-2 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors duration-200"
          >
            🔄 Refresh
          </button>
        </div>

        {!Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⭐</span>
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-4">
              {!Array.isArray(reviews) ? 'Error Loading Reviews' : 'No Reviews Found'}
            </div>
            <p className="text-gray-500">
              {!Array.isArray(reviews) 
                ? 'There was an issue loading the reviews. Please try refreshing.' 
                : 'This restaurant hasn\'t received any reviews yet.'
              }
            </p>
            {!Array.isArray(reviews) && (
              <button 
                onClick={fetchReviews}
                className="mt-4 px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors duration-200"
              >
                🔄 Retry
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {/* Customer Image */}
                    {review.customerImage && (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-200">
                        <img
                          src={review.customerImage}
                          alt={review.customerName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{review.customerName}</h3>
                      <p className="text-gray-600 text-sm">{formatDate(review.reviewDate)}</p>
                      <p className="text-gray-600 text-sm">Order: {review.orderNumber}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl mb-2">{getRatingStars(review.rating)}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(review.sentiment)}`}>
                      {review.sentiment}
                    </span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <p className="text-gray-900 text-lg leading-relaxed">"{review.review}"</p>
                </div>

                {/* Review Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {review.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Helpful</label>
                    <p className="text-gray-900">{review.helpfulCount || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Unhelpful</label>
                    <p className="text-gray-900">{review.unhelpfulCount || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Reports</label>
                    <p className="text-gray-900">{review.reportCount || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Views</label>
                    <p className="text-gray-900">{review.viewCount || 0}</p>
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Restaurant</label>
                      <p className="text-gray-900">{review.restaurantName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Location</label>
                      <p className="text-gray-900">{review.restaurantLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Debug Info */}
                <div className="bg-gray-100 rounded-lg p-3 mb-4 text-xs text-gray-600">
                  <div className="grid grid-cols-2 gap-2">
                    <div>isVisible: {String(review.isVisible)}</div>
                    <div>isFlagged: {String(review.isFlagged)}</div>
                    <div>Review ID: {review._id}</div>
                    <div>Status: {review.isVisible ? 'Visible' : 'Hidden'}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {/* Commented out toggle visibility button
                  <button
                    onClick={() => handleToggleVisibility(review._id, review.isVisible)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors duration-200"
                  >
                    {review.isVisible ? '👁️ Hide Review' : '👁️ Show Review'}
                  </button>
                  */}
                  
                  {/* Commented out flag review button
                  <button
                    onClick={() => handleFlagReview(review._id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors duration-200"
                  >
                    {review.isFlagged ? '🚩 Unflag Review' : '🚩 Flag Review'}
                  </button>
                  */}
                  
                  <button
                    onClick={() => navigate(`/restaurants/${id}/reviews/${review._id}`)}
                    className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-xl font-semibold text-sm hover:bg-yellow-700 transition-colors duration-200"
                  >
                    View Details
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

export default Reviews;

