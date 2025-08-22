import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectAuthState = (state) => state.auth;

// Memoized selectors to prevent unnecessary re-renders
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth.loading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);

export const selectToken = createSelector(
  [selectAuthState],
  (auth) => auth.token
);

// Compound selectors
export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectAuthLoading, selectAuthError],
  (isAuthenticated, loading, error) => ({
    isAuthenticated,
    loading,
    error,
    hasError: !!error
  })
);

// Selector for LoginScreen specific needs
export const selectLoginStatus = createSelector(
  [selectIsAuthenticated, selectAuthLoading, selectAuthError],
  (isAuthenticated, loading, error) => ({
    isAuthenticated,
    loading,
    error
  })
);

export const selectUserProfile = createSelector(
  [selectUser],
  (user) => user ? {
    name: user.name,
    phone: user.phone,
    role: user.role,
    profile: user.profile,
    isActive: user.isActive
  } : null
);

// Check if profile data is complete
export const selectNeedsProfileRefresh = createSelector(
  [selectIsAuthenticated, selectUser, selectAuthLoading],
  (isAuthenticated, user, loading) => {
    return isAuthenticated && !user && !loading;
  }
);
