import React, { useMemo, memo, useState, useCallback, useRef, useEffect } from 'react';
import { Token } from '../../types';
import { formatPrice, formatVolume, formatTimeAgo, cn } from '../../utils';
import { Card, CardContent } from '../atoms';
import { 
  Zap, 
  Square, 
  Paperclip, 
  Search, 
  Trophy, 
  Eye,
  Globe,
  User,
  Check,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { AppTooltip } from '../atoms/Tooltip';
import { TokenPopover } from '../molecules/TokenPopover';

type SortField = 'price' | 'volume24h' | 'marketCap' | 'priceChange24h' | 'timestamp';
type SortDirection = 'asc' | 'desc';

interface TokenColumnProps {
  title: string;
  tokens: Token[];
  accentColor: string;
  onRowClick?: (token: Token) => void;
  isFirst?: boolean;
  isMiddle?: boolean;
  isLast?: boolean;
}

export const TokenColumn: React.FC<TokenColumnProps> = memo(({
  title,
  tokens,
  accentColor,
  onRowClick,
  isFirst = false,
  isMiddle = false,
  isLast = false,
}) => {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [hoveredToken, setHoveredToken] = useState<Token | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }, [sortField]);

  const handleAvatarHover = useCallback((event: React.MouseEvent<HTMLDivElement>, token: Token) => {
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height,
    });
    setHoveredToken(token);
  }, []);

  const handleAvatarLeave = useCallback(() => {
    // Small delay to allow moving cursor to popover
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredToken(null);
      setPopoverPosition(null);
    }, 150);
  }, []);

  const handlePopoverEnter = useCallback(() => {
    // Clear timeout when entering popover
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handlePopoverLeave = useCallback(() => {
    setHoveredToken(null);
    setPopoverPosition(null);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const topTokens = useMemo(() => {
    const sorted = [...tokens].sort((a, b) => {
      const aValue: unknown = a[sortField];
      const bValue: unknown = b[sortField];
      
      // Handle number comparisons
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string comparisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Fallback for other types
      return 0;
    });
    
    return sorted.slice(0, 10);
  }, [tokens, sortField, sortDirection]);

  const formatShortTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return `${seconds}s`;
    if (minutes < 60) return `${minutes}m`;
    return `${hours}h`;
  };

  const formatContractAddress = (address?: string): string => {
    if (!address) {
      // Generate a random contract-like address
      const prefix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const suffix = ['pump', 'XTt1', 'xLRa', 'EaRj', 'Wasg', 'j3qG', 'P6NF', 'hZcE'][Math.floor(Math.random() * 8)];
      return `${prefix}...${suffix}`;
    }
    if (address.includes('...')) return address; // Already formatted
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatMarketCap = (mc: number): string => {
    if (mc >= 1e6) return `$${(mc / 1e6).toFixed(2)}M`;
    if (mc >= 1e3) return `$${(mc / 1e3).toFixed(2)}K`;
    return `$${mc.toFixed(2)}`;
  };

  return (
    <div className={cn(
      "bg-[#050814] shadow-[0_0_0_1px_rgba(9,13,28,0.6)] border-t border-b border-[#151b29]",
      isFirst && "border-l",
      isMiddle && "border-l border-r",
      isLast && "border-r",
      !isFirst && !isMiddle && !isLast && "border border-[#151b29] rounded-[14px]"
    )}>
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 border-b border-[#151b29]">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <span className="text-sm sm:text-base md:text-[16px] font-semibold text-[#FFFFF] truncate">
            {title}
          </span>
          {/* Sort Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSort('price')}
              className={cn(
                'p-0.5 rounded hover:bg-[#1a1f2e] transition-colors',
                sortField === 'price' && 'bg-[#1a1f2e]'
              )}
              title="Sort by price"
            >
              <ChevronUp className={cn(
                'h-3 w-3',
                sortField === 'price' && sortDirection === 'asc' 
                  ? 'text-[#52C5FF]' 
                  : 'text-[#6f7795]'
              )} />
            </button>
            <button
              onClick={() => handleSort('volume24h')}
              className={cn(
                'p-0.5 rounded hover:bg-[#1a1f2e] transition-colors',
                sortField === 'volume24h' && 'bg-[#1a1f2e]'
              )}
              title="Sort by volume"
            >
              <ChevronDown className={cn(
                'h-3 w-3',
                sortField === 'volume24h' && sortDirection === 'desc' 
                  ? 'text-[#52C5FF]' 
                  : 'text-[#6f7795]'
              )} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#9ba4c2]" />
          <span className="text-xs sm:text-sm md:text-[16px] font-semibold text-[#9ba4c2] whitespace-nowrap">{topTokens.length}</span>
          <div className="flex gap-0.5 sm:gap-1">
            {['P1', 'P2', 'P3'].map((p, idx) => (
              <button
                key={p}
                className={cn(
                  'px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold rounded whitespace-nowrap',
                  idx === 0 
                    ? 'bg-[#141b30] text-[#f5f7ff]' 
                    : 'text-[#6f7795] hover:text-[#9ba4c2]'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <CardContent className="p-0 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {topTokens.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No tokens in this column yet
          </div>
        ) : (
          topTokens.map((token) => {
            const timeAgo = formatShortTime(token.timestamp);
            const mc = formatMarketCap(token.marketCap);
            const volume = formatVolume(token.volume24h);
            const contract = formatContractAddress(token.contractAddress || token.id);
            const fee = token.fee || 0;
            const txCount = token.transactionCount || 0;

            // Generate percentage changes (matching image pattern)
            const percentageChanges = token.percentageChanges || [
              { value: token.priceChange24h },
              { value: 0 },
              { value: 0, label: '3mo' },
              { value: token.priceChange24h },
              { value: 0 },
              { value: 0 },
            ];

            return (
              <button
                key={token.id}
                type="button"
                onClick={() => onRowClick?.(token)}
                className="flex w-full flex-col gap-1 sm:gap-1.5 border-b border-[#151b29] bg-transparent px-2 sm:px-3 py-2 sm:py-2.5 text-left transition-colors last:border-b-0 hover:bg-[#222328] hover:border-[#263459] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                {/* Top Row: Avatar, Name, Time, Icons */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Avatar */}
                    <div 
                      className="flex-shrink-0 relative cursor-pointer group"
                      onMouseEnter={(e) => handleAvatarHover(e, token)}
                      onMouseLeave={handleAvatarLeave}
                    >
                      <div className="h-22 w-22 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-semibold text-white overflow-hidden transition-transform duration-200 group-hover:scale-110">
                        {token.symbol.charAt(0)}
                      </div>
                      {/* Small indicator dot */}
                      <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[#050814]" />
                    </div>
                    
                    {/* Name and Time */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                       
                        <span className="text-xs sm:text-sm md:text-[16px] font-semibold text-[#f5f7ff] truncate">
                          {token.name}
                        </span>
                        <AppTooltip content={token.symbol}>
                        <span className="text-xs sm:text-sm md:text-[16px] font-semibold text-[#777A8C] hover:text-blue-400 transition-colors duration-200 whitespace-nowrap">
                          {token.symbol}
                        </span>
                        </AppTooltip>
                        <span className="text-xs sm:text-sm md:text-[16px] text-[#12AF80] whitespace-nowrap">{timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Icons Row */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Square className="h-3 w-3 text-[#6f7795]" />
                    <Square className="h-3 w-3 text-[#6f7795] -ml-1.5" />
                    <Paperclip className="h-3 w-3 text-[#6f7795]" />
                    <Search className="h-3 w-3 text-[#6f7795]" />
                    <span className="text-[10px] text-[#6f7795]">{token.iconCount || 2}</span>
                    <span className="text-[10px] text-[#6f7795]">{token.badgeCount || 1}</span>
                    <Trophy className="h-3 w-3 text-[#6f7795]" />
                    <span className="text-[10px] text-[#6f7795]">{token.holderRatio || '0/1'}</span>
                    <Eye className="h-3 w-3 text-[#6f7795]" />
                    <span className="text-[10px] text-[#6f7795]">{token.holderCount || 0}</span>
                  </div>
                </div>

                {/* Middle Row: MC, V, F */}
                <div className="flex items-center justify-between text-xs sm:text-sm md:text-[16px] gap-1 sm:gap-2 flex-wrap">
                  <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <span className="text-[#6f7795] whitespace-nowrap">MC</span>
                    <AppTooltip content={'Market Cap'}>
                      <span className="text-[#52C5FF] font-medium truncate">{mc}</span>
                    </AppTooltip>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <span className="text-[#6f7795] whitespace-nowrap">V</span>
                    <AppTooltip content={'Volume'}>
                      <span className="text-[#f5f7ff] font-medium truncate">{volume}</span>
                    </AppTooltip>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <span className="text-[#6f7795] whitespace-nowrap">F</span>
                   <AppTooltip content={'Global Fees PAID'}><span className="text-[#f5f7ff] font-medium text-[10px] sm:text-xs md:text-[16px] truncate">
                      {fee.toFixed(3)} TX {txCount}
                    </span>
                    </AppTooltip>
                  </div>
                </div>

                {/* Percentage Changes Row */}
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                  {percentageChanges.map((change, idx) => {
                    const isPositive = change.value > 0;
                    const isNegative = change.value < 0;
                    const isNeutral = change.value === 0;
                    
                    return (
                      <span
                        key={idx}
                        className={cn(
                          'px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs md:text-[12px] font-semibold whitespace-nowrap',
                          isPositive && 'border border-gray-500/10 text-green-400 ',
                          isNegative && 'border border-gray-500/10 text-red-400',
                          isNeutral && !change.label && 'border border-gray-500/10 text-gray-400'
                        )}
                      >
                        {change.label || `${isPositive ? '+' : ''}${change.value.toFixed(0)}%`}
                      </span>
                    );
                  })}
                </div>

                {/* Contract Address */}
                <div className="flex items-center min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-[#6f7795] font-mono truncate">
                    {contract}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </CardContent>

      {/* Token Popover on Avatar Hover */}
      {hoveredToken && popoverPosition && (
        <div
          onMouseEnter={handlePopoverEnter}
          onMouseLeave={handlePopoverLeave}
        >
          <TokenPopover
            token={hoveredToken}
            position={popoverPosition}
            onClose={handlePopoverLeave}
          />
        </div>
      )}
    </div>
  );
});

TokenColumn.displayName = 'TokenColumn';