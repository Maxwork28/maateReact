import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { selectUserProfile } from '../store/selectors/authSelectors';

// Modern icon components with consistent styling
const DashboardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
  </svg>
);

const OrdersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const RestaurantsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const DeliveryIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const Layout = React.memo(({ children }) => {
  console.log('🏗️ Layout component rendered');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [deliverySubmenuOpen, setDeliverySubmenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUserProfile);
  
  console.log('👤 Layout - Current user:', user);
  console.log('📍 Layout - Current location:', location.pathname);
  console.log('📱 Layout - Sidebar collapsed:', sidebarCollapsed);
  console.log('📋 Layout - Delivery submenu open:', deliverySubmenuOpen);

  const handleLogout = () => {
    console.log('🚪 Layout - Logout clicked');
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = useMemo(() => [
    { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon, color: 'from-blue-500 to-blue-600' },
    { path: '/orders', label: 'Orders', icon: OrdersIcon, color: 'from-emerald-500 to-emerald-600' },
    { path: '/restaurants', label: 'Restaurants', icon: RestaurantsIcon, color: 'from-purple-500 to-purple-600' },
    { path: '/users', label: 'Users', icon: UsersIcon, color: 'from-pink-500 to-pink-600' },
    { 
      path: '/delivery-men', 
      label: 'Delivery Partners', 
      icon: DeliveryIcon, 
      color: 'from-orange-500 to-orange-600',
      hasSubmenu: true,
      submenu: [
        { path: '/delivery-men/active', label: 'Active Drivers' },
        { path: '/delivery-men/pending', label: 'Pending Verification' },
        { path: '/delivery-men/blocked', label: 'Blocked Drivers' }
      ]
    },
    { path: '/profile', label: 'Admin Profile', icon: ProfileIcon, color: 'from-indigo-500 to-indigo-600' },
  ], []);

  const isActive = useCallback((path) => {
    const active = path === '/delivery-men' 
      ? location.pathname.startsWith('/delivery-men')
      : location.pathname === path;
    console.log('🎯 Layout - isActive check:', path, '-> ', active);
    return active;
  }, [location.pathname]);

  const currentPageTitle = useMemo(() => {
    const activeItem = menuItems.find(item => isActive(item.path));
    return activeItem?.label || 'Dashboard';
  }, [menuItems, isActive]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Sidebar - Fixed layout structure */}
      <div className={`bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-500 ease-in-out shadow-2xl flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Maate</h1>
                  <p className="text-xs text-slate-400 font-medium">Admin Portal</p>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                console.log('🍔 Layout - Menu toggle clicked, current state:', sidebarCollapsed);
                setSidebarCollapsed(!sidebarCollapsed);
              }}
              className="p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-200 hover:scale-105"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable area */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {menuItems.map((item) => (
            <div key={item.path} className="mb-2">
              <button
                onClick={() => {
                  console.log('🔗 Layout - Menu item clicked:', item.label, item.path);
                  if (item.hasSubmenu) {
                    console.log('📂 Layout - Toggling submenu for:', item.label);
                    setDeliverySubmenuOpen(!deliverySubmenuOpen);
                  } else {
                    console.log('🧭 Layout - Navigating to:', item.path);
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center px-4 py-4 text-left transition-all duration-300 rounded-2xl group ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'bg-white/20' 
                    : `bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100`
                }`}>
                  <item.icon />
                </div>
                {!sidebarCollapsed && (
                  <>
                    <span className="ml-4 font-medium">{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronDownIcon className={`ml-auto transition-transform duration-300 ${deliverySubmenuOpen ? 'rotate-180' : ''}`} />
                    )}
                  </>
                )}
              </button>

              {item.hasSubmenu && !sidebarCollapsed && deliverySubmenuOpen && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.path}
                      onClick={() => {
                        console.log('📋 Layout - Submenu item clicked:', subItem.label, subItem.path);
                        navigate(subItem.path);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-left text-sm transition-all duration-200 rounded-xl ${
                        location.pathname === subItem.path
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Info and Logout - Fixed positioning at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-slate-700/50">
          {!sidebarCollapsed && user && (
            <div className="mb-4 p-4 bg-slate-700/50 rounded-2xl border border-slate-600/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">{user.name?.charAt(0) || 'A'}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-300">{user.phone}</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-red-600/20 hover:text-red-300 rounded-2xl transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center group-hover:bg-red-600/30 transition-colors duration-300">
              <LogoutIcon />
            </div>
            {!sidebarCollapsed && <span className="ml-4 font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                {currentPageTitle}
              </h2>
              <p className="text-gray-600 mt-1">Manage your platform efficiently</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>🕒</span>
                <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">Welcome back, {user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">Ready to manage?</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
});

export default Layout;
