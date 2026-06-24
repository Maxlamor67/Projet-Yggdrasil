import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Import MSW server
import './mocks/server';

// Import Leaflet mocks
import './mocks/leafletStub';

expect.extend(matchers);

// Mock environment variables
process.env.VITE_HTTP_API_URL = 'http://localhost:3001';

// Global mocks for browser APIs
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Suppress unhandled promise rejections for network errors in tests
process.on('unhandledRejection', (reason) => {
  // Ignore network errors from Axios in tests
  if (reason?.code === 'ERR_NETWORK' || reason?.message?.includes('Network Error')) {
    return;
  }
  throw reason;
});

afterEach(() => {
    cleanup();
});
