import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserStats } from '../../store/slices/usersSlice';

const UserStats = () => {
  console.log('🚀 UserStats component rendering');
  
  const dispatch = useDispatch();
  const { userStats, loading, error } = useSelector((state) => state.users);
  
  console.log('📊 UserStats component state:', { userStats, loading, error });
  
  const [timeRange, setTimeRange] = useState('7d');
  
  console.log('⏰ Time range state:', timeRange);

  useEffect(() => {
    console.log('🔄 UserStats component mounted, dispatching getUserStats');
    dispatch(getUserStats({ timeRange }));
  }, [dispatch, timeRange]);

  useEffect(() => {
    console.log('📈 UserStats data changed:', userStats);
  }, [userStats]);

  const handleTimeRangeChange = (newTimeRange) => {
    console.log('⏰ Time range changed from', timeRange, 'to', newTimeRange);
    setTimeRange(newTimeRange);
  };

  const formatNumber = (num) => {
    console.log('🔢 Formatting number:', num);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  const getTimeRangeLabel = (range) => {
    console.log('🏷️ Getting time range label for:', range);
    switch (range) {
      case '24h':
        return 'Last 24 Hours';
      case '7d':
        return 'Last 7 Days';
      case '30d':
        return 'Last 30 Days';
      case '90d':
        return 'Last 90 Days';
      case '1y':
        return 'Last Year';
      default:
        return 'Last 7 Days';
    }
  };

  console.log('🎨 Rendering UserStats component UI');
  
  if (loading) {
    console.log('⏳ UserStats component in loading state');
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">Loading user statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('❌ UserStats component error state:', error);
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500">Error loading user statistics: {error}</div>
      </div>
    );
  }

  console.log('📊 Rendering user stats with data:', userStats);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Statistics</h3>
          <p className="text-sm text-gray-500">{getTimeRangeLabel(timeRange)}</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '90d', '1y'].map((range) => {
            console.log('🎯 Rendering time range button:', range);
            return (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Total Users</p>
              <p className="text-2xl font-bold">
                {formatNumber(userStats?.totalUsers || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Active Users</p>
              <p className="text-2xl font-bold">
                {formatNumber(userStats?.activeUsers || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        {/* Verified Users */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Verified Users</p>
              <p className="text-2xl font-bold">
                {formatNumber(userStats?.verifiedUsers || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
          </div>
        </div>

        {/* New Users */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">New Users</p>
              <p className="text-2xl font-bold">
                {formatNumber(userStats?.newUsers || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🆕</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      {userStats && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Growth Rate */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userStats.growthRate ? `${userStats.growthRate.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">📈</span>
              </div>
            </div>
          </div>

          {/* Average Age */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Account Age</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userStats.averageAccountAge ? `${userStats.averageAccountAge.toFixed(1)} days` : 'N/A'}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">⏰</span>
              </div>
            </div>
          </div>

          {/* Engagement Rate */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userStats.engagementRate ? `${userStats.engagementRate.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600">🎯</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!userStats && !loading && !error && (
        <div className="mt-6 text-center py-8">
          <div className="text-gray-500">
            <p className="text-lg font-medium mb-2">No Statistics Available</p>
            <p className="text-sm">User statistics will appear here once data is available.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStats;
