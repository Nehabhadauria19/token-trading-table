// Core token types
export interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  holderCount: number;
  isNew: boolean;
  isFinalStretch: boolean;
  isMigrated: boolean;
  timestamp: number;
  trend: 'up' | 'down' | 'neutral';
  color: 'green' | 'red' | 'yellow' | 'blue' | 'purple';
  contractAddress?: string;
  transactionCount?: number;
  fee?: number;
  percentageChanges?: Array<{ value: number; label?: string }>;
  iconCount?: number;
  badgeCount?: number;
  holderRatio?: string; // e.g., "3/220"
}

// Table column definitions
export type ColumnType = 'newPairs' | 'finalStretch' | 'migrated';

export interface ColumnConfig {
  key: ColumnType;
  label: string;
  width: string;
  sortable: boolean;
  filterable: boolean;
  visible: boolean;
}

// Filter and sorting types
export interface FilterState {
  search: string;
  priceRange: [number, number];
  volumeRange: [number, number];
  columns: ColumnType[];
  sortBy: keyof Token;
  sortDirection: 'asc' | 'desc';
}

// Real-time update types
export interface PriceUpdate {
  tokenId: string;
  newPrice: number;
  change: number;
  timestamp: number;
}

export interface WebSocketMessage {
  type: 'price_update' | 'new_token' | 'token_removed';
  data: PriceUpdate | Token | string;
  timestamp: number;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface TableState {
  tokens: Token[];
  filteredTokens: Token[];
  loadingState: LoadingState;
  error: string | null;
  filters: FilterState;
  selectedTokens: string[];
}

// Component prop types
export interface TableProps {
  data: Token[];
  loading?: boolean;
  error?: string | null;
  onRowClick?: (token: Token) => void;
  onSort?: (column: keyof Token, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: FilterState) => void;
}

export interface TokenRowProps {
  token: Token;
  index: number;
  isSelected?: boolean;
  onClick?: (token: Token) => void;
  onHover?: (token: Token) => void;
}

export interface InteractiveElementProps {
  token: Token;
  type: 'popover' | 'tooltip' | 'modal';
  content: React.ReactNode;
  trigger: React.ReactNode;
}

// Performance monitoring
export interface PerformanceMetrics {
  renderTime: number;
  updateTime: number;
  memoryUsage: number;
  lighthouseScore: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

// Animation types
export interface AnimationConfig {
  duration: number;
  easing: string;
  stagger?: number;
}

export interface TransitionState {
  isTransitioning: boolean;
  fromValue: number;
  toValue: number;
  direction: 'up' | 'down';
}
