import { useState, useEffect } from 'react';
import { Token, PriceUpdate, WebSocketMessage } from '../types';
import { generateRandomToken } from '../utils';

/**
 * Mock WebSocket service for simulating real-time token price updates
 * 
 * Features:
 * - Simulates connection lifecycle (connect/disconnect)
 * - Sends price updates, new tokens, and token removals
 * - Implements exponential backoff reconnection strategy
 * - Configurable update frequency and message types
 */
class MockWebSocketService {
  private callbacks: Map<string, (data: unknown) => void> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Simulate connection delay
      setTimeout(() => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startPriceUpdates();
        console.log('Mock WebSocket connected');
        resolve();
      }, 100);
    });
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('Mock WebSocket disconnected');
  }

  private startPriceUpdates(): void {
    // Send initial token data
    setTimeout(() => {
      this.emit('initial_data', Array.from({ length: 50 }, () => generateRandomToken()));
    }, 200);

    // Send multiple updates per interval for more frequent changes
    this.intervalId = setInterval(() => {
      if (!this.isConnected) return;

      // Send 2-4 updates per interval for more frequent changes
      const updateCount = 2 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < updateCount; i++) {
        setTimeout(() => {
          if (!this.isConnected) return;
          
          const updateType = Math.random();
          
          if (updateType < 0.6) {
            // Price update (most common)
            this.sendPriceUpdate();
          } else if (updateType < 0.8) {
            // New token
            this.sendNewToken();
          } else {
            // Token removed
            this.sendTokenRemoved();
          }
        }, i * 200); // Stagger updates slightly
      }
    }, 800 + Math.random() * 700); // 0.8-1.5 seconds base interval
  }

  private sendPriceUpdate(): void {
    // Generate a token ID that could match existing tokens
    const tokenId = Math.random().toString(36).substr(2, 9);
    // More frequent and varied price changes
    const priceChange = (Math.random() - 0.5) * 30; // -15 to +15 for more volatility
    const newPrice = Math.max(0.001, 100 + priceChange);

    const update: PriceUpdate = {
      tokenId,
      newPrice,
      change: priceChange,
      timestamp: Date.now(),
    };

    const message: WebSocketMessage = {
      type: 'price_update',
      data: update,
      timestamp: Date.now(),
    };

    this.emit('price_update', message);
  }

  private sendNewToken(): void {
    const token = generateRandomToken();
    
    const message: WebSocketMessage = {
      type: 'new_token',
      data: token,
      timestamp: Date.now(),
    };

    this.emit('new_token', message);
  }

  private sendTokenRemoved(): void {
    const tokenId = Math.random().toString(36).substr(2, 9);
    
    const message: WebSocketMessage = {
      type: 'token_removed',
      data: tokenId,
      timestamp: Date.now(),
    };

    this.emit('token_removed', message);
  }

  on(event: string, callback: (data: unknown) => void): void {
    this.callbacks.set(event, callback);
  }

  off(event: string): void {
    this.callbacks.delete(event);
  }

  private emit(event: string, data: unknown): void {
    const callback = this.callbacks.get(event);
    if (callback) {
      callback(data);
    }
  }

  // Simulate connection errors for testing error handling
  simulateConnectionError(): void {
    if (this.isConnected) {
      this.disconnect();
      setTimeout(() => {
        this.connect().catch(() => {
          this.handleReconnect();
        });
      }, 1000);
    }
  }

  /**
   * Handles reconnection logic with exponential backoff
   * 
   * Strategy:
   * - Attempts up to maxReconnectAttempts (default: 5)
   * - Uses exponential backoff: 2^attempt * 1000ms
   * - Emits error event if max attempts reached
   * 
   * @private
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      // Exponential backoff: 2s, 4s, 8s, 16s, 32s
      setTimeout(() => {
        this.connect().catch(() => {
          this.handleReconnect();
        });
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('error', { message: 'Connection failed permanently' });
    }
  }
}

// Create singleton instance
export const mockWebSocketService = new MockWebSocketService();

// React hook for WebSocket connection
export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connect = async () => {
      try {
        await mockWebSocketService.connect();
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setError('Failed to connect to WebSocket');
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      mockWebSocketService.disconnect();
    };
  }, []);

  return { isConnected, error };
};

// Custom hook for listening to specific events
export const useWebSocketEvent = <T>(event: string, callback: (data: T) => void) => {
  useEffect(() => {
    mockWebSocketService.on(event, (data: unknown) => {
      callback(data as T);
    });
    return () => {
      mockWebSocketService.off(event);
    };
  }, [event, callback]);
};
