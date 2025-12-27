import React from 'react';
import { FilterState, ColumnType } from '../../types';
import { cn } from '../../utils';
import { Button } from '../atoms';

interface TableFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const columnOptions: Array<{ key: ColumnType; label: string }> = [
    { key: 'newPairs', label: 'New Pairs' },
    { key: 'finalStretch', label: 'Final Stretch' },
    { key: 'migrated', label: 'Migrated' },
  ];

  const handleSearchChange = (search: string) => {
    onFiltersChange({ search });
  };

  const handleColumnToggle = (column: ColumnType) => {
    const updatedColumns = filters.columns.includes(column)
      ? filters.columns.filter(c => c !== column)
      : [...filters.columns, column];
    onFiltersChange({ columns: updatedColumns });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      priceRange: [0, 1000000],
      volumeRange: [0, 1000000000],
      columns: ['newPairs', 'finalStretch', 'migrated'],
      sortBy: 'price',
      sortDirection: 'desc',
    });
  };

  const hasActiveFilters = filters.search || 
    filters.columns.length !== 3 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 1000000 ||
    filters.volumeRange[0] > 0 ||
    filters.volumeRange[1] < 1000000000;

  return (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search tokens..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Column Filters */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400 whitespace-nowrap">Filter by:</span>
          <div className="flex space-x-2">
            {columnOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleColumnToggle(option.key)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                  filters.columns.includes(option.key)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="whitespace-nowrap"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue rounded-full text-xs-300 border border-blue-500/30">
              Search: "{filters.search}"
            </span>
          )}
          {filters.columns.length !== 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Columns: {filters.columns.map(c => c.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ')}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
