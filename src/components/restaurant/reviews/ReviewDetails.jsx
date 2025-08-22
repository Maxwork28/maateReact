import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_REVIEW_DETAILS } from '../../../utils/apiUtils';

const ReviewDetails = () => {
  console.log('🔍 [ReviewDetails] Component function called');
  const { id, reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🔍 [ReviewDetails] Component rendered with:', { id, reviewId });

  const fetchReviewDetails = useCallback(async () => {
    if (!reviewId || reviewId === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [ReviewDetails] Fetching review details for reviewId:', reviewId);
      const response = await api.get(ADMIN_REVIEW_DETAILS(reviewId));
      console.log('🔍 [ReviewDetails] API Response:', response);

      // Handle different response structures
      let reviewData = null;
      if (response && response.data) {
        reviewData = response.data.data || response.data;
      } else if (response) {
        reviewData = response;
      }

      if (!reviewData) {
        throw new Error('No review data found in response');
      }

      console.log('🔍 [ReviewDetails] Extracted review data:', reviewData);
      setReview(reviewData);
    } catch (error) {
      console.error('❌ [ReviewDetails] Error fetching review details:', error);
      setError(error.message || 'Failed to fetch review details');
      toast.error(error.message || 'Failed to fetch review details');
    } finally {
      setLoading(false);
    }
  }, [reviewId]);

  useEffect(() => {
    console.log('🔍 [ReviewDetails] useEffect triggered with:', { reviewId, id });
    fetchReviewDetails();
  }, [fetchReviewDetails, reviewId, id]);

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!reviewId || reviewId === 'undefined') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Invalid Review ID</div>
        <p className="text-gray-500 mb-6">The review ID is missing or invalid</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/reviews`)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Reviews
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading review details...</div>
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
            onClick={fetchReviewDetails}
            className="mt-4 px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors duration-200 shadow-lg"
          >
            Retry
          </button>
          <button
            onClick={() => navigate(`/restaurants/${id}/reviews`)}
            className="mt-4 ml-4 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
          >
            Back to Reviews
          </button>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⭐</span>
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">Review not found</div>
        <p className="text-gray-500 mb-6">The review you're looking for doesn't exist</p>
        <button
          onClick={() => navigate(`/restaurants/${id}/reviews`)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Reviews
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-900 to-orange-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/restaurants/${id}/reviews`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Review Details</h1>
                <p className="text-xl text-yellow-200 font-medium">Customer Review & Management</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-2">{getRatingStars(review.rating)}</div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSentimentColor(review.sentiment)}`}>
                {review.sentiment}
              </span>
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
                onClick={() => navigate(`/restaurants/${id}/reviews`)}
                className="w-full px-4 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors duration-200 shadow-md"
              >
                📋 Back to Reviews
              </button>
              
              {/* Debug info */}
              <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                <div>Review ID: {review._id}</div>
                <div>isValid: {String(review.isVisible)}</div>
                <div>Status: {review.isVisible ? 'Visible' : 'Hidden'}</div>
                <div>Review Keys: {Object.keys(review).join(', ')}</div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              {review.customerImage && (
                <div className="text-center mb-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-200 mx-auto">
                    <img
                      src={review.customerImage}
                      alt={review.customerName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <p className="text-gray-900 font-medium">{review.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Customer ID</label>
                <p className="text-gray-900 font-mono text-sm">
                  {typeof review.customer === 'object' && review.customer._id 
                    ? review.customer._id 
                    : (typeof review.customer === 'string' ? review.customer : 'N/A')}
                </p>
              </div>
              {typeof review.customer === 'object' && review.customer.email && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{review.customer.email}</p>
                </div>
              )}
              {typeof review.customer === 'object' && review.customer.phone && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{review.customer.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Restaurant Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Restaurant Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <p className="text-gray-900 font-medium">{review.restaurantName}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <p className="text-gray-900 text-sm">{review.restaurantLocation}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Restaurant ID</label>
                <p className="text-gray-900 font-mono text-sm">
                  {typeof review.restaurant === 'object' && review.restaurant._id 
                    ? review.restaurant._id 
                    : (typeof review.restaurant === 'string' ? review.restaurant : 'N/A')}
                </p>
              </div>
              {typeof review.restaurant === 'object' && review.restaurant.email && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{review.restaurant.email}</p>
                </div>
              )}
              {typeof review.restaurant === 'object' && review.restaurant.phone && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{review.restaurant.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Order Number</label>
                <p className="text-gray-900 font-medium">{review.orderNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Order Date</label>
                <p className="text-gray-900">{formatDate(review.orderDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Order ID</label>
                <p className="text-gray-900 font-mono text-sm">
                  {typeof review.order === 'object' && review.order._id 
                    ? review.order._id 
                    : (typeof review.order === 'string' ? review.order : 'N/A')}
                </p>
              </div>
              {typeof review.order === 'object' && review.order.totalAmount && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total Amount</label>
                  <p className="text-gray-900">₹{review.order.totalAmount}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Content */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Content</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Review Text</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-900 text-lg leading-relaxed">"{review.review}"</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl">{getRatingStars(review.rating)}</div>
                    <span className="text-lg font-semibold text-gray-900">({review.rating}/5)</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sentiment</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSentimentColor(review.sentiment)}`}>
                    {review.sentiment}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Tags</h3>
              <div className="flex flex-wrap gap-3">
                {review.tags.map((tag, index) => (
                  <span key={index} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Review Statistics */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-green-600">👍</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{review.helpfulCount || 0}</p>
                <p className="text-gray-600">Helpful</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-red-600">👎</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{review.unhelpfulCount || 0}</p>
                <p className="text-gray-600">Unhelpful</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-orange-600">🚩</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">{review.reportCount || 0}</p>
                <p className="text-gray-600">Reports</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-blue-600">👁️</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{review.viewCount || 0}</p>
                <p className="text-gray-600">Views</p>
              </div>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Sentiment Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sentiment</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSentimentColor(review.sentiment)}`}>
                  {review.sentiment}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sentiment Score</label>
                <p className="text-gray-900">{(review.sentimentScore || 0).toFixed(4)}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Review Date</label>
                <p className="text-gray-900">{formatDate(review.reviewDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Created Date</label>
                <p className="text-gray-900">{formatDate(review.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                <p className="text-gray-900">{formatDate(review.updatedAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Review ID</label>
                <p className="text-gray-900 font-mono text-sm">{review._id}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Version</label>
                <p className="text-gray-900">v{review.__v || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
