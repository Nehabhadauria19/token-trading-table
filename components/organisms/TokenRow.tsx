import React, { useState, useMemo, useEffect, useRef, memo } from 'react';
import { Token } from '../../types';
import { formatPrice, formatPercentage, formatVolume, formatMarketCap, getChangeColor, getChangeBgColor, formatTimeAgo } from '../../utils';
import { cn } from '../../utils';
import { Badge } from '../atoms';
import { TokenPopover } from '../molecules/TokenPopover';

interface ColumnConfig {
  key: string;
  label: string;
  width: string;
  sortable?: boolean;
  filterable?: boolean;
}

interface TokenRowProps {
  token: Token;
  index: number;
  isHovered?: boolean;
  onHover?: (tokenId: string | null) => void;
  onClick?: (token: Token) => void;
  columns: ColumnConfig[];
}

export const TokenRow: React.FC<TokenRowProps> = memo(({
  token,
  index,
  isHovered,
  onHover,
  onClick,
  columns
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null);
  const [showTextPopover, setShowTextPopover] = useState(false);
  const [textPopoverPosition, setTextPopoverPosition] = useState({ x: 0, y: 0 });
  const prevPriceRef = useRef(token.price);

  const handleRowClick = () => {
    if (onClick) {
      onClick(token);
    }
  };

  const handleRowHover = () => {
    if (onHover) {
      onHover(token.id);
    }
  };

  const handleRowLeave = () => {
    if (onHover) {
      onHover(null);
    }
  };

  const handlePopoverTrigger = (event: React.MouseEvent, show: boolean) => {
    event.stopPropagation();
    if (show) {
      const rect = event.currentTarget.getBoundingClientRect();
      setPopoverPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height
      });
    }
    setShowPopover(show);
  };

  const handleTextPopoverShow = (event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setTextPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height
    });
    setShowTextPopover(true);
  };

  const handleTextPopoverHide = () => {
    setShowTextPopover(false);
  };

  // Memoized formatted values for performance
  const formattedValues = useMemo(() => ({
    price: formatPrice(token.price),
    change24h: formatPercentage(token.priceChange24h),
    volume24h: formatVolume(token.volume24h),
    marketCap: formatMarketCap(token.marketCap),
    holders: token.holderCount.toLocaleString(),
    timeAgo: formatTimeAgo(token.timestamp),
  }), [token]);

  const changeColorClass = getChangeColor(token.priceChange24h);
  const changeBgClass = getChangeBgColor(token.priceChange24h);

  // Smooth color transition on price updates
  useEffect(() => {
    const prevPrice = prevPriceRef.current;
    let direction: 'up' | 'down' | null = null;
    
    if (token.price > prevPrice) {
      direction = 'up';
    } else if (token.price < prevPrice) {
      direction = 'down';
    }
    
    prevPriceRef.current = token.price;
    
    if (direction) {
      setPriceDirection(direction);
      const timeoutId = setTimeout(() => {
        setPriceDirection(null);
      }, 600);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [token.price]);

  return (
    <>
      <tr
        className={cn(
          'transition-colors duration-200',
          isHovered ? 'bg-[#0b1220]' : 'hover:bg-[#0b1220]',
          priceDirection === 'up' && 'bg-emerald-500/5',
          priceDirection === 'down' && 'bg-rose-500/5',
          'cursor-pointer'
        )}
        onClick={handleRowClick}
        onMouseEnter={handleRowHover}
        onMouseLeave={handleRowLeave}
      >
        {/* Token Column */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {token.symbol.charAt(0)}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <p 
                  className="truncate text-[13px] font-semibold text-[#f5f7ff] cursor-help hover:text-blue-400 transition-colors duration-200"
                  onMouseEnter={handleTextPopoverShow}
                  onMouseLeave={handleTextPopoverHide}
                >
                  {token.symbol}
                </p>
                {(token.isNew || token.isFinalStretch || token.isMigrated) && (
                  <div className="flex space-x-1">
                    {token.isNew && (
                      <Badge 
                        variant="success" 
                        className="text-xs px-1 py-0"
                        onClick={(e) => handlePopoverTrigger(e, true)}
                      >
                        NEW
                      </Badge>
                    )}
                    {token.isFinalStretch && (
                      <Badge 
                        variant="warning" 
                        className="text-xs px-1 py-0"
                        onClick={(e) => handlePopoverTrigger(e, true)}
                      >
                        FINAL
                      </Badge>
                    )}
                    {token.isMigrated && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-1 py-0"
                        onClick={(e) => handlePopoverTrigger(e, true)}
                      >
                        MIGRATED
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <p 
                className="text-xs text-gray-400 truncate cursor-help hover:text-blue-400 transition-colors duration-200"
                onMouseEnter={handleTextPopoverShow}
                onMouseLeave={handleTextPopoverHide}
              >
                {token.name}
              </p>
            </div>
          </div>
        </td>

        {/* Price Column */}
        <td className="px-4 py-4 whitespace-nowrap">
          <div
            className={cn(
              'text-sm font-medium transition-colors duration-300',
              priceDirection === 'up' && 'text-green-400',
              priceDirection === 'down' && 'text-red-400'
            )}
          >
            {formattedValues.price}
          </div>
        </td>

        {/* 24h Change Column */}
        <td className="px-4 py-4 whitespace-nowrap">
          <div className={cn('text-sm font-medium', changeColorClass)}>
            {formattedValues.change24h}
          </div>
        </td>

        {/* 24h Volume Column */}
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-300">
            {formattedValues.volume24h}
          </div>
        </td>

        {/* Market Cap Column */}
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-300">
            {formattedValues.marketCap}
          </div>
        </td>

        {/* Holders Column */}
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-300">
            {formattedValues.holders}
          </div>
        </td>

        {/* New Pairs Column */}
        <td className="px-4 py-4 whitespace-nowrap text-center">
          {token.isNew ? (
            <Badge 
              variant="success" 
              className="cursor-pointer"
              onClick={(e) => handlePopoverTrigger(e, true)}
            >
              Active
            </Badge>
          ) : (
            <span className="text-gray-500">—</span>
          )}
        </td>

        {/* Final Stretch Column */}
        <td className="px-4 py-4 whitespace-nowrap text-center">
          {token.isFinalStretch ? (
            <Badge 
              variant="warning" 
              className="cursor-pointer"
              onClick={(e) => handlePopoverTrigger(e, true)}
            >
              Active
            </Badge>
          ) : (
            <span className="text-gray-500">—</span>
          )}
        </td>

        {/* Migrated Column */}
        <td className="px-4 py-4 whitespace-nowrap text-center">
          {token.isMigrated ? (
            <Badge 
              variant="secondary" 
              className="cursor-pointer"
              onClick={(e) => handlePopoverTrigger(e, true)}
            >
              Active
            </Badge>
          ) : (
            <span className="text-gray-500">—</span>
          )}
        </td>
      </tr>

      {/* Badge Popover */}
      {showPopover && (
        <TokenPopover
          token={token}
          position={popoverPosition}
          onClose={() => setShowPopover(false)}
        />
      )}

      {/* Text Hover Popover */}
      {showTextPopover && (
        <TokenPopover
          token={token}
          position={textPopoverPosition}
          onClose={() => setShowTextPopover(false)}
        />
      )}
    </>
  );
});

TokenRow.displayName = 'TokenRow';
