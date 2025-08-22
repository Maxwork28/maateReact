import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../store/slices/authSlice';
import { selectUser, selectNeedsProfileRefresh } from '../store/selectors/authSelectors';

const Dashboard = React.memo(() => {
  console.log('🏠 Dashboard component rendered');
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const needsProfileRefresh = useSelector(selectNeedsProfileRefresh);
  
  console.log('👤 Dashboard - Current user:', user);
  console.log('🔄 Dashboard - Needs profile refresh:', needsProfileRefresh);

  useEffect(() => {
    if (needsProfileRefresh) {
      console.log('📡 Dashboard useEffect - Fetching profile (needed)');
      dispatch(getProfile());
    } else {
      console.log('⏭️ Dashboard useEffect - Skipping profile fetch (not needed)');
    }
  }, [dispatch, needsProfileRefresh]);

  const getStatusColor = useCallback((status) => {
    console.log('🎨 Dashboard - Getting status color for:', status);
    switch (status) {
      case 'Delivered':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'In Transit':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Preparing':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }, []);

  const stats = useMemo(() => [
    { 
      title: 'Total Orders', 
      value: '1,234', 
      change: '+12%', 
      changeType: 'positive',
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      title: 'Active Restaurants', 
      value: '89', 
      change: '+5%', 
      changeType: 'positive',
      icon: '🏪',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    { 
      title: 'Total Users', 
      value: '5,678', 
      change: '+8%', 
      changeType: 'positive',
      icon: '👥',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    { 
      title: 'Delivery Partners', 
      value: '234', 
      change: '+15%', 
      changeType: 'positive',
      icon: '🚚',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
  ], []);

  const recentOrders = useMemo(() => [
    { id: '#1234', restaurant: 'Pizza Palace', customer: 'John Doe', amount: '$45.00', status: 'Delivered', time: '2 min ago' },
    { id: '#1235', restaurant: 'Burger House', customer: 'Jane Smith', amount: '$32.50', status: 'In Transit', time: '15 min ago' },
    { id: '#1236', restaurant: 'Sushi Bar', customer: 'Mike Johnson', amount: '$67.80', status: 'Preparing', time: '28 min ago' },
    { id: '#1237', restaurant: 'Coffee Shop', customer: 'Sarah Wilson', amount: '$18.90', status: 'Delivered', time: '45 min ago' },
  ], []);

  const quickActions = useMemo(() => [
    { title: 'View Orders', description: 'Check all orders', icon: '📋', path: '/orders', color: 'from-blue-500 to-blue-600' },
    { title: 'Manage Restaurants', description: 'Add or edit restaurants', icon: '🏪', path: '/restaurants', color: 'from-emerald-500 to-emerald-600' },
    { title: 'User Management', description: 'Manage user accounts', icon: '👥', path: '/users', color: 'from-purple-500 to-purple-600' },
    { title: 'Delivery Partners', description: 'Manage delivery partners', icon: '🚚', path: '/delivery-men', color: 'from-orange-500 to-orange-600' },
  ], []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-3xl">👋</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Welcome back, {user?.name || 'Admin'}!
              </h1>
              <p className="text-xl text-gray-200 font-medium">
                Here's what's happening with your Maate platform today.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <span>🕒</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'text-emerald-600 bg-emerald-100' : 'text-red-600 bg-red-100'
              }`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <button 
              onClick={() => console.log('🔍 Dashboard - View All Orders clicked')}
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors duration-200"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-bold text-gray-900">{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{order.restaurant}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{order.customer}</p>
                    <p className="text-xs text-gray-400">{order.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => console.log('⚡ Dashboard - Quick action clicked:', action.title, action.path)}
                className="group p-6 border-2 border-gray-100 rounded-2xl hover:border-purple-200 hover:bg-purple-50 transition-all duration-300 text-left transform hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-200">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
            <div>
              <span className="text-lg font-semibold text-emerald-800">API Server</span>
              <p className="text-sm text-emerald-600">Online & Healthy</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <span className="text-lg font-semibold text-blue-800">Database</span>
              <p className="text-sm text-blue-600">Connected & Stable</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-purple-50 border border-purple-200 rounded-2xl">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
            <div>
              <span className="text-lg font-semibold text-purple-800">Payment Gateway</span>
              <p className="text-sm text-purple-600">Active & Secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dashboard;
