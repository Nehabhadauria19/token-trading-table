import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token, FilterState, LoadingState } from '../types';

/**
 * Redux state interface for token management
 * Manages token data, filtering, sorting, and selection state
 */
interface TokenState {
  tokens: Token[];
  filteredTokens: Token[];
  loadingState: LoadingState;
  error: string | null;
  filters: FilterState;
  selectedTokens: string[];
}

const initialState: TokenState = {
  tokens: [],
  filteredTokens: [],
  loadingState: 'idle',
  error: null,
  filters: {
    search: '',
    priceRange: [0, 1000000],
    volumeRange: [0, 1000000000],
    columns: ['newPairs', 'finalStretch', 'migrated'],
    sortBy: 'price',
    sortDirection: 'desc',
  },
  selectedTokens: [],
};

/**
 * Redux slice for token management
 * Handles CRUD operations, filtering, sorting, and selection
 */
const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token[]>) => {
      state.tokens = action.payload;
      state.filteredTokens = action.payload;
      state.loadingState = 'success';
      state.error = null;
    },
    setLoadingState: (state, action: PayloadAction<LoadingState>) => {
      state.loadingState = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loadingState = 'error';
    },
    updateToken: (state, action: PayloadAction<Token>) => {
      const index = state.tokens.findIndex(token => token.id === action.payload.id);
      if (index !== -1) {
        state.tokens[index] = action.payload;
        state.filteredTokens[index] = action.payload;
      }
    },
    addToken: (state, action: PayloadAction<Token>) => {
      state.tokens.unshift(action.payload);
      state.filteredTokens.unshift(action.payload);
    },
    removeToken: (state, action: PayloadAction<string>) => {
      state.tokens = state.tokens.filter(token => token.id !== action.payload);
      state.filteredTokens = state.filteredTokens.filter(token => token.id !== action.payload);
    },
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    /**
     * Applies all active filters and sorting to tokens
     * Filters by: search term, price range, volume range, and column types
     * Sorts by: configured sortBy field and direction
     * 
     * @param state - Current token state
     * @returns Updated state with filteredTokens populated
     */
    applyFilters: (state) => {
      let filtered = [...state.tokens];
      
      // Apply search filter (case-insensitive match on symbol or name)
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(token => 
          token.symbol.toLowerCase().includes(searchTerm) ||
          token.name.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply price range filter (inclusive bounds)
      filtered = filtered.filter(token => 
        token.price >= state.filters.priceRange[0] &&
        token.price <= state.filters.priceRange[1]
      );
      
      // Apply volume range filter (inclusive bounds)
      filtered = filtered.filter(token => 
        token.volume24h >= state.filters.volumeRange[0] &&
        token.volume24h <= state.filters.volumeRange[1]
      );
      
      // Apply column filters (newPairs, finalStretch, migrated)
      if (state.filters.columns.length > 0) {
        filtered = filtered.filter(token => {
          if (state.filters.columns.includes('newPairs') && token.isNew) return true;
          if (state.filters.columns.includes('finalStretch') && token.isFinalStretch) return true;
          if (state.filters.columns.includes('migrated') && token.isMigrated) return true;
          return false;
        });
      }
      
      // Apply sorting (supports string and number types)
      filtered.sort((a, b) => {
        const aValue = a[state.filters.sortBy];
        const bValue = b[state.filters.sortBy];
        
        // String comparison (locale-aware)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return state.filters.sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Number comparison
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return state.filters.sortDirection === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }
        
        return 0;
      });
      
      state.filteredTokens = filtered;
    },
    toggleTokenSelection: (state, action: PayloadAction<string>) => {
      const tokenId = action.payload;
      if (state.selectedTokens.includes(tokenId)) {
        state.selectedTokens = state.selectedTokens.filter(id => id !== tokenId);
      } else {
        state.selectedTokens.push(tokenId);
      }
    },
    clearSelection: (state) => {
      state.selectedTokens = [];
    },
  },
});

export const {
  setTokens,
  setLoadingState,
  setError,
  updateToken,
  addToken,
  removeToken,
  setFilters,
  applyFilters,
  toggleTokenSelection,
  clearSelection,
} = tokenSlice.actions;

export default tokenSlice.reducer;
