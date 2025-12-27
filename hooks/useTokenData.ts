import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '../store';
import { setTokens, setLoadingState, setError, updateToken, addToken, removeToken, applyFilters } from '../store/tokenSlice';
import { useWebSocket, useWebSocketEvent } from '../services/websocket';
import { WebSocketMessage, Token } from '../types';
import { generateRandomToken } from '../utils';

/**
 * Custom hook for managing token data with real-time updates
 * 
 * Features:
 * - Initial data fetching via React Query (with progressive loading simulation)
 * - Real-time updates via WebSocket mock
 * - Automatic state synchronization between React Query and Redux
 * - Periodic token updates for visual feedback
 * - Error handling for both query and WebSocket errors
 * 
 * @returns {Object} Token data, loading state, error state, and utility functions
 * @returns {Token[]} tokens - All tokens in the store
 * @returns {Token[]} filteredTokens - Tokens after applying filters
 * @returns {LoadingState} loadingState - Current loading state
 * @returns {string|null} error - Error message if any
 * @returns {boolean} isConnected - WebSocket connection status
 * @returns {Function} refreshData - Function to manually refresh token data
 * @returns {Function} handleTokenClick - Handler for token click events
 */
export const useTokenData = () => {
  const dispatch = useDispatch();
  const { isConnected, error: wsError } = useWebSocket();
  const { tokens, filteredTokens, loadingState, error } = useSelector(
    (state: RootState) => state.tokens
  );

  // Initial token data via React Query
  const {
    data: initialTokens,
    isLoading: isInitialLoading,
    error: queryError,
    refetch,
  } = useQuery<Token[], Error>({
    queryKey: ['tokens'],
    queryFn: async () => {
      // Simulate network latency for progressive loading behaviour
      await new Promise((resolve) => setTimeout(resolve, 500));
      return Array.from({ length: 50 }, () => generateRandomToken());
    },
  });

  // Sync loading state with query
  useEffect(() => {
    if (isInitialLoading) {
      dispatch(setLoadingState('loading'));
    }
  }, [dispatch, isInitialLoading]);

  // Push query data into Redux store
  useEffect(() => {
    if (initialTokens && initialTokens.length > 0) {
      dispatch(setTokens(initialTokens));
    }
  }, [dispatch, initialTokens]);

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      dispatch(setError(queryError.message));
    }
  }, [dispatch, queryError]);

  // Handle WebSocket connection errors
  useEffect(() => {
    if (wsError) {
      dispatch(setError(wsError));
    }
  }, [wsError, dispatch]);

  // Handle real-time price updates
  useWebSocketEvent<WebSocketMessage>('price_update', (message) => {
    if (message.type === 'price_update' && typeof message.data === 'object' && 'tokenId' in message.data) {
      const priceData = message.data as { tokenId: string; newPrice: number; change: number };
      const { tokenId, newPrice, change } = priceData;
      
      // Find and update the token - update random tokens if ID doesn't match
      const token = tokens.find(t => t.id === tokenId) || tokens[Math.floor(Math.random() * tokens.length)];
      if (token) {
        const updatedToken: Token = {
          ...token,
          price: newPrice,
          priceChange24h: change,
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
          timestamp: Date.now() - Math.random() * 60000, // Update timestamp for "time ago" changes
        };
        dispatch(updateToken(updatedToken));
        dispatch(applyFilters());
      }
    }
  });

  /**
   * Periodic token updates for frequent visual changes
   * 
   * Updates random tokens every second to simulate active trading:
   * - Updates timestamp (0-2 minutes ago)
   * - Applies small price variations (±5%)
   * - Updates 24h change percentage
   * 
   * This creates a more dynamic UI with frequent updates
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (tokens.length > 0) {
        // Update random tokens' timestamps and prices for frequent changes
        const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
        if (randomToken) {
          const updatedToken: Token = {
            ...randomToken,
            timestamp: Date.now() - Math.random() * 120000, // Update timestamp (0-2 minutes ago)
            price: randomToken.price * (0.95 + Math.random() * 0.1), // Small price variations (±5%)
            priceChange24h: (Math.random() - 0.5) * 50, // Update percentage changes
          };
          dispatch(updateToken(updatedToken));
          dispatch(applyFilters());
        }
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [tokens, dispatch]);

  // Handle new token additions
  useWebSocketEvent<WebSocketMessage>('new_token', (message) => {
    if (message.type === 'new_token' && typeof message.data === 'object') {
      const token = message.data as Token;
      dispatch(addToken(token));
      dispatch(applyFilters());
    }
  });

  // Handle token removals
  useWebSocketEvent<WebSocketMessage>('token_removed', (message) => {
    if (message.type === 'token_removed' && typeof message.data === 'string') {
      dispatch(removeToken(message.data));
      dispatch(applyFilters());
    }
  });

  const refreshData = useCallback(() => {
    dispatch(setLoadingState('loading'));
    void refetch();
  }, [dispatch, refetch]);

  const handleTokenClick = useCallback((token: Token) => {
    console.log('Token clicked:', token);
    // You can implement navigation or modal opening here
  }, []);

  return {
    tokens,
    filteredTokens,
    loadingState,
    error,
    isConnected,
    refreshData,
    handleTokenClick,
  };
};
