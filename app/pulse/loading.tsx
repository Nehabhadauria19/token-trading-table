import React from 'react';
import { Card, CardContent } from '../../components/atoms';
import { TableSkeleton } from '../../components/organisms/TableSkeleton';

export default function PulseLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-5 w-32 rounded-md bg-gray-700 animate-pulse" />
          <div className="h-8 w-24 rounded-md bg-gray-700 animate-pulse" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-gray-800 bg-gray-900/60">
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded-md bg-gray-700 animate-pulse" />
                  <div className="h-3 w-12 rounded-md bg-gray-700 animate-pulse" />
                </div>
                {Array.from({ length: 4 }).map((__, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-900/70 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-gray-700 animate-pulse" />
                      <div className="space-y-1">
                        <div className="h-3 w-16 rounded-md bg-gray-700 animate-pulse" />
                        <div className="h-2 w-20 rounded-md bg-gray-800 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="h-3 w-12 rounded-md bg-gray-700 animate-pulse" />
                      <div className="h-2 w-10 rounded-md bg-gray-800 animate-pulse" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-gray-800 bg-gray-900/50">
          <CardContent className="p-0">
            <TableSkeleton columns={9} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



