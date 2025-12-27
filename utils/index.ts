import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for conditional classnames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format numbers for display
export const formatPrice = (price: number): string => {
  if (price >= 1) {
    return `$${price.toFixed(2)}`;
  } else if (price >= 0.001) {
    return `$${price.toFixed(4)}`;
  } else {
    return `$${price.toFixed(8)}`;
  }
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(2)}B`;
  } else if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(2)}M`;
  } else if (volume >= 1e3) {
    return `$${(volume / 1e3).toFixed(2)}K`;
  } else {
    return `$${volume.toFixed(2)}`;
  }
};

export const formatMarketCap = (marketCap: number): string => {
  return formatVolume(marketCap);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};

// Color utilities
export const getChangeColor = (change: number): string => {
  if (change > 0) return 'text-green-400';
  if (change < 0) return 'text-red-400';
  return 'text-gray-400';
};

export const getChangeBgColor = (change: number): string => {
  if (change > 0) return 'bg-green-500/10 border-green-500/20';
  if (change < 0) return 'bg-red-500/10 border-red-500/20';
  return 'bg-gray-500/10 border-gray-500/20';
};

// Debounce utility
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Date/time utilities
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

// Generate random data for development
import { Token } from '../types';

export const generateRandomToken = (): Token => {
  const symbols = ['BTC', 'ETH', 'SOL', 'DOGE', 'SHIB', 'ADA', 'DOT', 'AVAX', 'MATIC', 'UNI', 'pissmas', 'TikTok', 'BRENDEN', 'BOBE', 'sol', 'NVIDIAAI', 'ASCEND', 'BlackWhale', 'LAUNCHR', 'DUVEMAS', 'fly', 'Amazon', 'BOGE', 'WHALON'];
  const names = ['Bitcoin', 'Ethereum', 'Solana', 'Dogecoin', 'Shiba Inu', 'Cardano', 'Polkadot', 'Avalanche', 'Polygon', 'Uniswap', 'pissmas', 'TikTok', 'THE WATER GUY', 'BOBE', '猪', 'NVIDIAAIDev', 'ASCEND', 'The Black Whale', 'LAUNCHR', 'DUVEMAS', 'flying squirrel', 'Amazon AI Coin', 'BOGE', 'Whale alon'];
  const colors: Array<'green' | 'red' | 'yellow' | 'blue' | 'purple'> = ['green', 'red', 'yellow', 'blue', 'purple'];
  
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const price = Math.random() * 1000 + 0.001;
  const change24h = (Math.random() - 0.5) * 100;
  const volume = Math.random() * 1e9;
  const marketCap = Math.random() * 1e10;
  const liquidity = Math.random() * 1e8;
  const holderCount = Math.floor(Math.random() * 1000000);
  const contractPrefix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const contractSuffix = ['pump', 'XTt1', 'xLRa', 'EaRj', 'Wasg', 'j3qG', 'P6NF', 'hZcE'][Math.floor(Math.random() * 8)];
  const contractAddress = `${contractPrefix}...${contractSuffix}`;
  
  // Generate percentage changes array
  const percentageChanges = [
    { value: change24h },
    { value: Math.random() > 0.5 ? 0 : (Math.random() - 0.5) * 20 },
    { value: 0, label: ['3mo', '1h', '1mo', '6d', '2d', '4h', '2m', '19d', '1h', '24m', '57m'][Math.floor(Math.random() * 11)] },
    { value: change24h },
    { value: 0 },
    { value: 0 },
  ];
  
  const holderRatio = `${Math.floor(Math.random() * 10)}/${Math.floor(Math.random() * 1000)}`;
  
  // Ensure better distribution across columns
  // Each token is guaranteed to be in at least one column with good distribution
  const columnType = Math.random();
  let isNew = false;
  let isFinalStretch = false;
  let isMigrated = false;
  
  // Distribute tokens across columns: ~35% New, ~35% Final Stretch, ~30% Migrated
  if (columnType < 0.35) {
    isNew = true;
  } else if (columnType < 0.70) {
    isFinalStretch = true;
  } else {
    isMigrated = true;
  }
  
  // 10% chance of being in multiple columns (overlap for realism)
  if (Math.random() < 0.1) {
    const overlapType = Math.random();
    if (overlapType < 0.33) {
      isNew = true;
      isFinalStretch = true;
    } else if (overlapType < 0.66) {
      isFinalStretch = true;
      isMigrated = true;
    } else {
      isNew = true;
      isMigrated = true;
    }
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    symbol,
    name,
    price,
    priceChange24h: change24h,
    volume24h: volume,
    marketCap,
    liquidity,
    holderCount,
    isNew,
    isFinalStretch,
    isMigrated,
    timestamp: Date.now() - Math.random() * 3600000, // Recent timestamps (within last hour)
    trend: change24h > 0 ? 'up' : change24h < 0 ? 'down' : 'neutral',
    color: colors[Math.floor(Math.random() * colors.length)],
    contractAddress,
    transactionCount: Math.floor(Math.random() * 3000),
    fee: Math.random() * 0.1,
    percentageChanges,
    iconCount: Math.floor(Math.random() * 5) + 1,
    badgeCount: Math.floor(Math.random() * 5) + 1,
    holderRatio,
  };
};

// Performance utilities
/**
 * Measures the execution time of a function
 * 
 * @param name - Name identifier for the performance measurement
 * @param fn - Function to measure
 * @returns The result of the function execution
 * 
 * @example
 * const result = measurePerformance('filterTokens', () => filterTokens(data));
 */
export const measurePerformance = <T>(name: string, fn: () => T): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

/**
 * Measures interaction performance (for <100ms requirement)
 * 
 * @param name - Name identifier for the interaction
 * @param fn - Async function to measure
 * @returns Promise that resolves with the result and timing info
 * 
 * @example
 * const { result, duration } = await measureInteraction('sortTokens', () => sortTokens());
 * if (duration > 100) console.warn('Interaction exceeded 100ms');
 */
export const measureInteraction = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;
  
  if (duration > 100) {
    console.warn(`⚠️ ${name} took ${duration.toFixed(2)}ms (exceeds 100ms target)`);
  } else {
    console.log(`✅ ${name} took ${duration.toFixed(2)}ms`);
  }
  
  return { result, duration };
};

/**
 * Creates a performance monitor hook for React components
 * Tracks render times and warns if they exceed thresholds
 */
export const createPerformanceMonitor = () => {
  const renderTimes: number[] = [];
  
  return {
    startRender: () => performance.now(),
    endRender: (startTime: number) => {
      const duration = performance.now() - startTime;
      renderTimes.push(duration);
      
      // Keep only last 100 measurements
      if (renderTimes.length > 100) {
        renderTimes.shift();
      }
      
      // Warn if render exceeds 16ms (60fps threshold)
      if (duration > 16) {
        console.warn(`⚠️ Slow render: ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    },
    getAverageRenderTime: () => {
      if (renderTimes.length === 0) return 0;
      return renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    },
    getStats: () => ({
      average: renderTimes.length > 0 
        ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length 
        : 0,
      max: renderTimes.length > 0 ? Math.max(...renderTimes) : 0,
      min: renderTimes.length > 0 ? Math.min(...renderTimes) : 0,
      count: renderTimes.length,
    }),
  };
};

// Animation utilities
export const easeInOut = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

export const smoothStep = (start: number, end: number, t: number): number => {
  const clampedT = Math.min(Math.max(t, 0), 1);
  return start + (end - start) * easeInOut(clampedT);
};
