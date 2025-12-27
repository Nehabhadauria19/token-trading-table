'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useTokenData } from '../hooks/useTokenData';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { Button } from '../components/atoms';
import { Token } from '../types';
import { TokenColumn } from '../components/organisms/TokenColumn';
import { TokenModal } from '../components/organisms/TokenModal';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const Pulse: React.FC = () => {
  const {
    tokens,
    filteredTokens,
    loadingState,
    refreshData,
  } = useTokenData();

  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTokenClick = useCallback((token: Token) => {
    setSelectedToken(token);
    setIsModalOpen(true);
  }, []);

  const columnBuckets = useMemo(
    () => ({
      newPairs: tokens.filter((t) => t.isNew),
      finalStretch: tokens.filter((t) => t.isFinalStretch),
      migrated: tokens.filter((t) => t.isMigrated),
    }),
    [tokens],
  );

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#050711] text-white">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 border-b border-[#1b2030] bg-[#050711]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-indigo-500 text-xs sm:text-sm font-semibold">
                A
              </div>
              <span className="text-xs sm:text-sm font-semibold tracking-[0.18em] text-[#9ba4c2] uppercase truncate">
                Axiom
              </span>
            </div>
            <div className="hidden items-center gap-1 text-sm sm:text-[16px] font-medium uppercase tracking-[0.18em] text-[#6e7593] md:flex">
              <button className="rounded-full px-3 py-1 hover:bg-[#111526] hover:text-[#f5f7ff] transition-colors">
                Discover
              </button>
              <button className="rounded-full bg-[#f5f7ff] px-3 py-1 text-[#050711] shadow-sm">
                Pulse
              </button>
              <button className="rounded-full px-3 py-1 hover:bg-[#111526] hover:text-[#f5f7ff] transition-colors">
                Trackers
              </button>
              <button className="rounded-full px-3 py-1 hover:bg-[#111526] hover:text-[#f5f7ff] transition-colors">
                Perpetuals
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <div className="hidden items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-[16px] text-[#7f88a5] sm:flex">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">{filteredTokens.length} tokens</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-[#101523] px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-[#dfe4ff]">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400" />
                <span className="whitespace-nowrap">SOL</span>
              </button>
              <Button
                size="sm"
                className="rounded-full bg-sky-500 px-2 sm:px-3 md:px-4 text-[10px] sm:text-xs font-semibold hover:bg-sky-600 whitespace-nowrap"
              >
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] space-y-4 sm:space-y-6 px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Pulse header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl md:text-[22px] font-semibold text-[#f5f7ff]">Pulse</h1>
              <span className="rounded-full bg-[#101523] px-1.5 sm:px-2 py-[2px] text-xs sm:text-sm md:text-[16px] font-medium text-[#9ba4c2] whitespace-nowrap">
                SOL
              </span>
            </div>
            <p className="mt-1 text-[10px] sm:text-xs text-[#7c86a3]">Live token discovery, sorted by lifecycle.</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-[16px] text-[#7c86a3] flex-wrap">
            <span className="hidden font-medium uppercase tracking-[0.18em] sm:inline whitespace-nowrap">
              Phases
            </span>
            <div className="flex rounded-full bg-[#050814] p-[2px] sm:p-[3px]">
              {['P1', 'P2', 'P3'].map((p, index) => (
                <button
                  key={p}
                  className={`px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[16px] font-semibold rounded-full whitespace-nowrap ${
                    index === 0 ? 'bg-[#141b30] text-[#f5f7ff]' : 'text-[#7c86a3]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loadingState === 'loading'}
              className="ml-0 sm:ml-2 flex items-center gap-1 border-[#262c3e] bg-[#050814] text-xs sm:text-sm md:text-[16px] text-[#dfe4ff] whitespace-nowrap"
            >
              <RefreshCw
                className={`h-3 w-3 ${loadingState === 'loading' ? 'animate-spin' : ''}`}
              />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
          </div>
        </div>
        {/* Token Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <TokenColumn
            title="New Pairs"
            tokens={columnBuckets.newPairs}
            accentColor="bg-green-400"
            onRowClick={handleTokenClick}
            isFirst={true}
          />
          <TokenColumn
            title="Final Stretch"
            tokens={columnBuckets.finalStretch}
            accentColor="bg-yellow-400"
            onRowClick={handleTokenClick}
            isMiddle={true}
          />
          <TokenColumn
            title="Migrated"
            tokens={columnBuckets.migrated}
            accentColor="bg-blue-400"
            onRowClick={handleTokenClick}
            isLast={true}
          />
        </div>
      </div>

      <TokenModal
        token={selectedToken}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setSelectedToken(null);
          }
        }}
      />
      </div>
    </ErrorBoundary>
  );
};
