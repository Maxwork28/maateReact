import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchUsers, 
  verifyUser, 
  blockUser, 
  unblockUser, 
  toggleUserStatus,
  searchUsers,
  fetchUserStats
} from '../../store/slices/usersSlice';
import { toast } from 'react-toastify';

const Users = () => {
  console.log('🚀 Users component rendering');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.users);
  
  console.log('📊 Users component state:', { users, loading, error });
  
  const [filters, setFilters] = useState({
    status: '',
    verified: '',
    search: '',
    city: '',
    state: ''
  });
  
  console.log('🔍 Current filters state:', filters);
  
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [verificationReason, setVerificationReason] = useState('');
  const [blockReason, setBlockReason] = useState('');

  console.log('🎭 Modal states:', { 
    showVerifyModal, 
    showBlockModal, 
    selectedUser, 
    verificationReason, 
    blockReason 
  });

  useEffect(() => {
    console.log('🔄 Users component mounted, dispatching fetchUsers');
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleFilterChange = (key, value) => {
    console.log(`🔧 Filter change: ${key} = ${value}`);
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      console.log('🔧 New filters state:', newFilters);
      
      // Auto-apply filters after a short delay (except for search)
      if (key !== 'search') {
        setTimeout(() => {
          console.log('🔄 Auto-applying filters after change');
          const fetchParams = {};
          if (newFilters.status) fetchParams.status = newFilters.status;
          if (newFilters.verified) fetchParams.verified = newFilters.verified;
          if (newFilters.city) fetchParams.city = newFilters.city;
          if (newFilters.state) fetchParams.state = newFilters.state;
          
          console.log('🔄 Auto-fetching users with filters:', fetchParams);
          dispatch(fetchUsers(fetchParams));
        }, 500); // 500ms delay to avoid too many API calls
      }
      
      return newFilters;
    });
  };

  const handleSearch = () => {
    console.log('🔍 Executing search with filters:', filters);
    
    // If there's a search query, use searchUsers
    if (filters.search && filters.search.trim().length >= 2) {
      dispatch(searchUsers({ search: filters.search.trim() }));
    } else {
      // If no search query, use fetchUsers with all other filters
      const fetchParams = {};
      if (filters.status) fetchParams.status = filters.status;
      if (filters.verified) fetchParams.verified = filters.verified;
      if (filters.city) fetchParams.city = filters.city;
      if (filters.state) fetchParams.state = filters.state;
      
      console.log('🔍 Fetching users with filters:', fetchParams);
      dispatch(fetchUsers(fetchParams));
    }
  };

  const handleVerify = (user) => {
    console.log('✅ Opening verify modal for user:', user);
    setSelectedUser(user);
    setShowVerifyModal(true);
  };

  const handleBlock = (user) => {
    console.log('🚫 Opening block modal for user:', user);
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const handleUnblock = (user) => {
    console.log('🔓 Unblocking user:', user);
    dispatch(unblockUser({ userId: user.id || user._id, adminNote: 'Admin unblock' }))
      .then((result) => {
        console.log('🔓 Unblock result:', result);
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('User unblocked successfully');
          console.log('✅ User unblocked successfully');
          // Refresh the users list
          dispatch(fetchUsers());
        }
      })
      .catch((error) => {
        console.error('❌ Error unblocking user:', error);
        toast.error('Failed to unblock user');
      });
  };

  const handleToggleStatus = (user) => {
    console.log('🔄 Toggling status for user:', user);
    dispatch(toggleUserStatus(user.id || user._id))
      .then((result) => {
        console.log('🔄 Toggle status result:', result);
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('User status updated successfully');
          console.log('✅ User status updated successfully');
          // Refresh the users list
          dispatch(fetchUsers());
        }
      })
      .catch((error) => {
        console.error('❌ Error toggling user status:', error);
        toast.error('Failed to update user status');
      });
  };

  const confirmVerification = () => {
    console.log('✅ Confirming verification for user:', selectedUser);
    console.log('✅ Verification reason:', verificationReason);
    
    dispatch(verifyUser({ userId: selectedUser.id || selectedUser._id, reason: verificationReason }))
      .then((result) => {
        console.log('✅ Verification result:', result);
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('User verified successfully');
          console.log('✅ User verified successfully');
          setShowVerifyModal(false);
          setSelectedUser(null);
          setVerificationReason('');
          // Refresh the users list
          dispatch(fetchUsers());
        }
      })
      .catch((error) => {
        console.error('❌ Error verifying user:', error);
        toast.error('Failed to verify user');
      });
  };

  const confirmBlock = () => {
    console.log('🚫 Confirming block for user:', selectedUser);
    console.log('🚫 Block reason:', blockReason);
    
    dispatch(blockUser({ userId: selectedUser.id || selectedUser._id, reason: blockReason }))
      .then((result) => {
        console.log('🚫 Block result:', result);
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('User blocked successfully');
          console.log('✅ User blocked successfully');
          setShowBlockModal(false);
          setSelectedUser(null);
          setBlockReason('');
          // Refresh the users list
          dispatch(fetchUsers());
        }
      })
      .catch((error) => {
        console.error('❌ Error blocking user:', error);
        toast.error('Failed to block user');
      });
  };

  const closeModals = () => {
    console.log('🚪 Closing all modals');
    setShowVerifyModal(false);
    setShowBlockModal(false);
    setSelectedUser(null);
    setVerificationReason('');
    setBlockReason('');
  };

  const handleViewDetails = (user) => {
    console.log('👁️ Viewing details for user:', user);
    const userId = user.id || user._id;
    console.log('👁️ Navigating to user details with ID:', userId);
    navigate(`/users/${userId}`);
  };

  console.log('🎨 Rendering Users component UI');
  
  if (loading) {
    console.log('⏳ Users component in loading state');
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    console.error('❌ Users component error state:', error);
    return <div className="text-red-500">Error: {error}</div>;
  }

  console.log(`📋 Rendering ${users.length} users`);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">User Management</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={filters.verified}
            onChange={(e) => handleFilterChange('verified', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Verification</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

                  <input
          type="text"
          placeholder="Search by name, phone, email, or city (min 2 chars)"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        />

          <input
            type="text"
            placeholder="City"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />

          <input
            type="text"
            placeholder="State"
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
          <button
            onClick={() => {
              console.log('🧹 Clearing all filters');
              setFilters({
                status: '',
                verified: '',
                search: '',
                city: '',
                state: ''
              });
              dispatch(fetchUsers());
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Clear
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Filters are automatically applied. Status and verification filters work immediately, 
          while text search requires at least 2 characters.
        </p>
      </div>

      {/* Users List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              console.log('👤 Rendering user row:', user);
              return (
                <tr key={user.id || user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                                         <div className="flex items-center">
                       <div className="h-10 w-10 flex-shrink-0">
                         <img
                           className="h-10 w-10 rounded-full"
                           src={user.profileImage || '/default-avatar.png'}
                           alt=""
                         />
                       </div>
                                               <div className="ml-4">
                          <div 
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 hover:underline"
                            onClick={() => handleViewDetails(user)}
                            title="Click to view user details"
                          >
                            {user.fullName || `${user.firstName} ${user.lastName}`}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                     </div>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                       user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                     }`}>
                       {user.isActive ? 'Active' : 'Inactive'}
                     </span>
                   </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                       user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                     }`}>
                       {user.isVerified ? 'Verified' : 'Unverified'}
                     </span>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.city}, {user.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-green-600 hover:text-green-900 font-medium"
                        title="View user details"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleVerify(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleBlock(user)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Block
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Verify User</h3>
              <textarea
                value={verificationReason}
                onChange={(e) => setVerificationReason(e.target.value)}
                placeholder="Reason for verification"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                rows="3"
              />
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmVerification}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Verify
                </button>
                <button
                  onClick={closeModals}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Block User</h3>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Reason for blocking"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                rows="3"
              />
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmBlock}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Block
                </button>
                <button
                  onClick={closeModals}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
