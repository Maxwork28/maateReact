import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { ADMIN_USER_REVIEWS } from '../../../utils/apiUtils';

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
      console.log('🔍 [Reviews] Fetching reviews for user:', id);
      const response = await api.get(ADMIN_USER_REVIEWS(id));
      console.log('🔍 [Reviews] API Response:', response);
      
      // Handle response structure
      let reviewsData = [];
      if (response?.data?.data && Array.isArray(response.data.data)) {
        reviewsData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        reviewsData = response.data;
      }
      
      console.log('🔍 [Reviews] Extracted reviews data:', reviewsData);
      setReviews(reviewsData);
    } catch (err) {
      console.error('❌ [Reviews] Error fetching reviews:', err);
      setError(err.message || 'Failed to fetch reviews');
      toast.error('Failed to fetch user reviews');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading user reviews...</div>
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
      <div className="bg-gradient-to-r from-yellow-900 to-yellow-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
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
                <h1 className="text-3xl font-bold">User Reviews</h1>
                <p className="text-yellow-100">Manage and monitor user reviews</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{reviews.length}</div>
              <div className="text-yellow-100">Total Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Review History</h2>
          <p className="text-gray-600 mt-1">All reviews written by this user</p>
        </div>
        
        {reviews.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⭐</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reviews Found</h3>
            <p className="text-gray-500">This user hasn't written any reviews yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reviews.map((review, index) => (
              <div key={review._id || index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {review.restaurant?.businessName ? review.restaurant.businessName.charAt(0).toUpperCase() : 'R'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {review.restaurant?.businessName || 'Restaurant'}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        {getRatingStars(review.rating || 0)}
                        <span className="text-sm text-gray-600">({review.rating || 0}/5)</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {review.review || 'No review provided'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      {review.isVisible ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Visible</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Hidden</span>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/users/${id}/reviews/${review._id}`)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors duration-200"
                    >
                      View
                    </button>
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

export default Reviews;
