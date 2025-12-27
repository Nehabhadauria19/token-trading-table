import React, { memo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Token } from '../../types';
import { cn } from '../../utils';

interface ColumnConfig {
  key: string;
  label: string;
  width: string;
  sortable?: boolean;
  filterable?: boolean;
}

interface ColumnHeaderProps {
  column: ColumnConfig;
  sortBy?: keyof Token;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: keyof Token, direction: 'asc' | 'desc') => void;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = memo(({
  column,
  sortBy,
  sortDirection,
  onSort
}) => {
  const isSorted = sortBy === column.key;
  const canSort = column.sortable && onSort;

  const handleSort = () => {
    if (!canSort) return;

    const newDirection: 'asc' | 'desc' = 
      isSorted && sortDirection === 'desc' ? 'asc' : 'desc';
    
    onSort(column.key as keyof Token, newDirection);
  };

  return (
    <th 
      className={cn(
        'px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider',
        column.width,
        canSort && 'cursor-pointer hover:text-white transition-colors'
      )}
      onClick={handleSort}
    >
      <div className="flex items-center space-x-1">
        <span>{column.label}</span>
        {canSort && (
          <div className="flex flex-col">
            <ChevronUp 
              className={cn(
                'w-3 h-3',
                isSorted && sortDirection === 'asc' 
                  ? 'text-white' 
                  : 'text-gray-500'
              )}
            />
            <ChevronDown 
              className={cn(
                'w-3 h-3 -mt-1',
                isSorted && sortDirection === 'desc' 
                  ? 'text-white' 
                  : 'text-gray-500'
              )}
            />
          </div>
        )}
      </div>
    </th>
  );
});

ColumnHeader.displayName = 'ColumnHeader';
