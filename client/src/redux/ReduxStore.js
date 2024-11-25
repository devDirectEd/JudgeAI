// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/AuthenticationSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Persist entire auth slice
  blacklist: ['loading'] // Optionally exclude loading state
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Add these to prevent serialization errors
        ignoredPaths: ['auth.user']
      }
    })
});

export const persistor = persistStore(store);