import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ordersReducer from './slices/ordersSlice';
import restaurantsReducer from './slices/restaurantsSlice';
import usersReducer from './slices/usersSlice';
import deliveryMenReducer from './slices/deliveryMenSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    restaurants: restaurantsReducer,
    users: usersReducer,
    deliveryMen: deliveryMenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
