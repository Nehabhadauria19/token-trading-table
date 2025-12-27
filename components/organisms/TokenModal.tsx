import React, { memo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Token } from '../../types';
import { formatPrice, formatPercentage, formatVolume, formatMarketCap, formatTimeAgo, cn } from '../../utils';
import { Badge, Button, Card, CardContent } from '../atoms';

interface TokenModalProps {
  token: Token | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TokenModal: React.FC<TokenModalProps> = memo(({ token, open, onOpenChange }) => {
  if (!token) return null;

  const price = formatPrice(token.price);
  const change = formatPercentage(token.priceChange24h);
  const volume = formatVolume(token.volume24h);
  const marketCap = formatMarketCap(token.marketCap);
  const liquidity = formatVolume(token.liquidity);
  const holders = token.holderCount.toLocaleString();
  const timeAgo = formatTimeAgo(token.timestamp);

  const changeColor =
    token.priceChange24h > 0
      ? 'text-green-400'
      : token.priceChange24h < 0
        ? 'text-red-400'
        : 'text-gray-400';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
          <Card className="border-gray-700 bg-gray-900 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-semibold">
                    {token.symbol.charAt(0)}
                  </div>
                  <div>
                    <Dialog.Title className="text-base font-semibold text-white">
                      {token.symbol}
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-gray-400">
                      {token.name}
                    </Dialog.Description>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-full px-2 py-1 text-xs text-gray-400 hover:bg-gray-800 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    Close
                  </button>
                </Dialog.Close>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-400">Price</p>
                  <p className="text-sm font-semibold text-white">{price}</p>
                </div>
                <div>
                  <p className="text-gray-400">24h Change</p>
                  <p className={cn('text-sm font-semibold', changeColor)}>{change}</p>
                </div>
                <div>
                  <p className="text-gray-400">24h Volume</p>
                  <p className="text-sm font-semibold text-white">{volume}</p>
                </div>
                <div>
                  <p className="text-gray-400">Market Cap</p>
                  <p className="text-sm font-semibold text-white">{marketCap}</p>
                </div>
                <div>
                  <p className="text-gray-400">Liquidity</p>
                  <p className="text-sm font-semibold text-white">{liquidity}</p>
                </div>
                <div>
                  <p className="text-gray-400">Holders</p>
                  <p className="text-sm font-semibold text-white">{holders}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[16px] text-gray-400">
                <span>Added {timeAgo}</span>
                <span>ID: {token.id}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {token.isNew && (
                  <Badge variant="success" className="text-[16px] px-2 py-0.5">
                    New Pair
                  </Badge>
                )}
                {token.isFinalStretch && (
                  <Badge variant="warning" className="text-[16px] px-2 py-0.5">
                    Final Stretch
                  </Badge>
                )}
                {token.isMigrated && (
                  <Badge variant="secondary" className="text-[16px] px-2 py-0.5">
                    Migrated
                  </Badge>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  View on Explorer
                </Button>
                <Button size="sm">Open in Tracker</Button>
              </div>
            </CardContent>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

TokenModal.displayName = 'TokenModal';


