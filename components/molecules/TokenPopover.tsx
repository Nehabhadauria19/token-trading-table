import React, { useEffect, useRef, memo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Token } from '../../types';
import { formatPrice, formatVolume, formatMarketCap, formatTimeAgo } from '../../utils';
import { cn } from '../../utils';
import { Card, CardContent } from '../atoms';

interface TokenPopoverProps {
  token: Token;
  position: { x: number; y: number };
  onClose: () => void;
}

export const TokenPopover: React.FC<TokenPopoverProps> = memo(({
  token,
  position,
  onClose
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Only add click handler if this is a click-triggered popover
    // For hover popovers, we don't need click outside
    // document.addEventListener('mousedown', handleClickOutside);
    // return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 pointer-events-auto"
      style={{
        left: position.x - 150, // Center the popover
        top: position.y + 8,
      }}
      onMouseEnter={() => {}} // Keep popover open when hovering over it
      onMouseLeave={onClose}
    >
      <Popover.Root open={true} onOpenChange={(open) => !open && onClose()}>
        <Popover.Portal>
          <Popover.Content
            className="rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-lg animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            sideOffset={5}
          >
            <div className="w-80">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {token.symbol.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{token.symbol}</h3>
                  <p className="text-sm text-gray-400">{token.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Price</p>
                  <p className="text-white font-medium">{formatPrice(token.price)}</p>
                </div>
                <div>
                  <p className="text-gray-400">24h Change</p>
                  <p className={cn(
                    'font-medium',
                    token.priceChange24h > 0 ? 'text-green-400' : 
                    token.priceChange24h < 0 ? 'text-red-400' : 'text-gray-400'
                  )}>
                    {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">24h Volume</p>
                  <p className="text-white font-medium">{formatVolume(token.volume24h)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Market Cap</p>
                  <p className="text-white font-medium">{formatMarketCap(token.marketCap)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Liquidity</p>
                  <p className="text-white font-medium">{formatVolume(token.liquidity)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Holders</p>
                  <p className="text-white font-medium">{token.holderCount.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Added</span>
                  <span className="text-gray-300 text-xs">{formatTimeAgo(token.timestamp)}</span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {token.isNew && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    New Pair
                  </span>
                )}
                {token.isFinalStretch && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    Final Stretch
                  </span>
                )}
                {token.isMigrated && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Migrated
                  </span>
                )}
              </div>
            </div>
            
            <Popover.Arrow className="fill-gray-800" />
          </Popover.Content>
        </Popover.Portal>
        </Popover.Root>
    </div>
  );
});

TokenPopover.displayName = 'TokenPopover';
