'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/atoms';

interface PulseErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PulseError({ error, reset }: PulseErrorProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-xl font-semibold text-red-400">Something went wrong</h1>
        <p className="text-sm text-gray-400">
          {error.message || 'An unexpected error occurred while loading Pulse.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button size="sm" variant="outline" onClick={reset}>
            Retry
          </Button>
          <Button
            size="sm"
            onClick={() => {
              router.push('/');
            }}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}


