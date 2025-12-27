import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './tokenSlice';

export const store = configureStore({
  reducer: {
    tokens: tokenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['tokens/updateToken', 'tokens/addToken'],
        ignoredPaths: ['tokens.tokens', 'tokens.filteredTokens'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
