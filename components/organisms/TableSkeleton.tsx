import React from 'react';
import { Skeleton } from '../atoms';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  columns, 
  rows = 10 
}) => {
  return (
    <div className="w-full">
      {/* Filters Skeleton */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton shimmer className="h-10 flex-1 min-w-[200px]" />
          <div className="flex space-x-2">
            <Skeleton shimmer className="h-8 w-20" />
            <Skeleton shimmer className="h-8 w-24" />
            <Skeleton shimmer className="h-8 w-20" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            {/* Header Skeleton */}
            <thead className="bg-gray-750 border-b border-gray-700">
              <tr>
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="px-6 py-3">
                    <Skeleton shimmer className="h-4 w-full" />
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Body Skeleton */}
            <tbody className="divide-y divide-gray-700">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-750">
                  {/* Token Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <Skeleton shimmer className="w-10 h-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton shimmer className="h-4 w-16" />
                        <Skeleton shimmer className="h-3 w-24" />
                      </div>
                    </div>
                  </td>
                  
                  {/* Price Column */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Skeleton shimmer className="h-4 w-16" />
                  </td>
                  
                  {/* 24h Change Column */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Skeleton shimmer className="h-4 w-20" />
                  </td>
                  
                  {/* 24h Volume Column */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Skeleton shimmer className="h-4 w-20" />
                  </td>
                  
                  {/* Market Cap Column */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Skeleton shimmer className="h-4 w-20" />
                  </td>
                  
                  {/* Holders Column */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Skeleton shimmer className="h-4 w-16" />
                  </td>
                  
                  {/* Status Columns */}
                  {Array.from({ length: columns - 6 }).map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-4 whitespace-nowrap text-center">
                      <Skeleton shimmer className="h-6 w-16 mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Stats Skeleton */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <Skeleton shimmer className="h-4 w-48" />
        <Skeleton shimmer className="h-4 w-32" />
      </div>
    </div>
  );
};
