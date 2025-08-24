import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_USER_REVIEWS } from '../../../utils/apiUtils';

const ReviewDetails = () => {
  const { id, reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviewDetails();
  }, [id, reviewId]);

  const fetchReviewDetails = async () => {
    if (!reviewId || reviewId === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [ReviewDetails] Fetching review details for reviewId:', reviewId);
      const response = await api.get(`${ADMIN_USER_REVIEWS(id)}/${reviewId}`);
      console.log('🔍 [ReviewDetails] API Response:', response);

      // Handle response structure
      let reviewData = null;
      if (response?.data?.data) {
        reviewData = response.data.data;
      } else if (response?.data) {
        reviewData = response.data;
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
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const getStatusBadge = (isVisible) => {
    return isVisible ? (
      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
        Visible
      </span>
    ) : (
      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium">
        Hidden
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading review details...</div>
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
          <div className="text-xl font-bold text-red-800 mb-4">Error Loading Review</div>
          <div className="text-red-600 mb-6">{error}</div>
          <button 
            onClick={() => navigate(`/users/${id}/reviews`)}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Back to Reviews
          </button>
        </div>
      </div>
    );
  }

  if (!review) {
  return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❓</span>
          </div>
          <div className="text-xl font-bold text-yellow-800 mb-4">Review Not Found</div>
          <div className="text-yellow-600 mb-6">The requested review could not be found.</div>
          <button 
            onClick={() => navigate(`/users/${id}/reviews`)}
            className="px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors duration-200"
          >
            Back to Reviews
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
                onClick={() => navigate(`/users/${id}/reviews`)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold">Review Details</h1>
                <p className="text-yellow-100">Detailed view of user review</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{review.rating || 0}/5</div>
              <div className="text-yellow-100">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8">
          {/* Restaurant Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {review.restaurantName ? review.restaurantName.charAt(0).toUpperCase() : 'R'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {review.restaurantName || 'Restaurant'}
              </h2>
              <p className="text-gray-600">
                {review.restaurantLocation || 'Location not specified'}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Rating</h3>
            <div className="flex items-center space-x-2">
              {getRatingStars(review.rating || 0)}
              <span className="text-lg text-gray-700 ml-2">({review.rating || 0}/5)</span>
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Review Text</h3>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-gray-700 leading-relaxed">
                {review.review || 'No review text provided'}
              </p>
            </div>
          </div>

          {/* Review Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Review Status</h3>
            <div className="flex items-center space-x-3">
              {getStatusBadge(review.isVisible)}
              <span className="text-sm text-gray-600">
                {review.isVisible ? 'This review is visible to other users' : 'This review is hidden from other users'}
              </span>
            </div>
          </div>

          {/* Review Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Review Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Review ID:</span>
                  <span className="text-gray-800 font-mono text-sm">{review._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Review Date:</span>
                  <span className="text-gray-800">
                    {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-800">
                    {review.updatedAt ? new Date(review.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">User Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="text-gray-800 font-mono text-sm">{review.customer?._id || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User Name:</span>
                  <span className="text-gray-800">{review.customerName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User Phone:</span>
                  <span className="text-gray-800">{review.customer?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate(`/users/${id}/reviews`)}
          className="px-8 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200"
        >
          Back to Reviews
        </button>
        <button
          onClick={() => navigate(`/users/${id}`)}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Back to User
        </button>
      </div>
    </div>
  );
};

export default ReviewDetails;