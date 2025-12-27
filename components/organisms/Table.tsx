import React, { useMemo, useState, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setFilters, applyFilters } from '../../store/tokenSlice';
import { Token, FilterState } from '../../types';
import { cn } from '../../utils';
import { TokenRow } from './TokenRow';
import { ColumnHeader } from './ColumnHeader';
import { TableFilters } from './TableFilters';
import { TableSkeleton } from './TableSkeleton';

interface TableProps {
  className?: string;
  onRowClick?: (token: Token) => void;
}

export const Table: React.FC<TableProps> = memo(({ className, onRowClick }) => {
  const dispatch = useDispatch();
  const { filteredTokens, loadingState, error, filters } = useSelector(
    (state: RootState) => state.tokens
  );

  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Memoized columns configuration
  const columns = useMemo(() => [
    {
      key: 'token' as const,
      label: 'Token',
      width: 'w-[300px]',
      sortable: false,
    },
    {
      key: 'price' as const,
      label: 'Price',
      width: 'w-[120px]',
      sortable: true,
    },
    {
      key: 'priceChange24h' as const,
      label: '24h Change',
      width: 'w-[120px]',
      sortable: true,
    },
    {
      key: 'volume24h' as const,
      label: '24h Volume',
      width: 'w-[140px]',
      sortable: true,
    },
    {
      key: 'marketCap' as const,
      label: 'Market Cap',
      width: 'w-[140px]',
      sortable: true,
    },
    {
      key: 'holderCount' as const,
      label: 'Holders',
      width: 'w-[100px]',
      sortable: true,
    },
    {
      key: 'newPairs' as const,
      label: 'New Pairs',
      width: 'w-[100px]',
      sortable: false,
      filterable: true,
    },
    {
      key: 'finalStretch' as const,
      label: 'Final Stretch',
      width: 'w-[120px]',
      sortable: false,
      filterable: true,
    },
    {
      key: 'migrated' as const,
      label: 'Migrated',
      width: 'w-[100px]',
      sortable: false,
      filterable: true,
    },
  ], []);

  const handleSort = useCallback((column: keyof Token, direction: 'asc' | 'desc') => {
    dispatch(setFilters({ sortBy: column, sortDirection: direction }));
    dispatch(applyFilters());
  }, [dispatch]);

  const handleRowHover = useCallback((tokenId: string | null) => {
    setHoveredRow(tokenId);
  }, []);

  if (loadingState === 'loading') {
    return <TableSkeleton columns={columns.length} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-400">Error loading data</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Table Filters */}
      <TableFilters 
        filters={filters}
        onFiltersChange={(newFilters: Partial<FilterState>) => {
          dispatch(setFilters(newFilters));
          dispatch(applyFilters());
        }}
      />
      
      {/* Table Container */}
      <div className="relative overflow-hidden rounded-[14px] border border-[#151b29] bg-[#050814]">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            {/* Table Header */}
            <thead className="border-b border-[#151b29] bg-[#050814]">
              <tr>
                {columns.map((column) => (
                  <ColumnHeader
                    key={column.key}
                    column={column}
                    sortBy={filters.sortBy}
                    sortDirection={filters.sortDirection}
                    onSort={handleSort}
                  />
                ))}
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-gray-700">
              {filteredTokens.length === 0 ? (
                <tr>
                  <td 
                    colSpan={columns.length} 
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No tokens found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredTokens.map((token, index) => (
                  <TokenRow
                    key={token.id}
                    token={token}
                    index={index}
                    isHovered={hoveredRow === token.id}
                    onHover={handleRowHover}
                    onClick={onRowClick}
                    columns={columns}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Table Stats */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <div>
          Showing {filteredTokens.length} of {filteredTokens.length} tokens
        </div>
        <div>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
});

Table.displayName = 'Table';
