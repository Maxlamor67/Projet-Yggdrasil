/**
 * Test utilities for rendering components with TanStack Router
 */

import type { ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Router
} from '@tanstack/react-router';

interface RouterRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  initialEntries?: string[];
  routes?: any[];
}

/**
 * Creates a test router with memory history
 */
export function createTestRouter(initialEntries: string[] = ['/']) {
  const history = createMemoryHistory({
    initialEntries,
  });

  const rootRoute = createRootRoute({
    component: () => <div>Root</div>,
  });

  return { history, rootRoute };
}

/**
 * Renders a component with TanStack Router context
 */
export function renderWithRouter(
  ui: ReactNode,
  options?: RouterRenderOptions
) {
  const queryClient = options?.queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const { history, rootRoute } = createTestRouter(options?.initialEntries);

  // Create a simple router for testing
  const router = createRouter({
    routeTree: rootRoute,
    history,
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient,
    router,
    history,
  };
}

/**
 * Renders a route component with full router context
 */
export function renderRoute(
  component: ReactNode,
  options?: RouterRenderOptions
) {
  const queryClient = options?.queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return {
    ...render(component, { wrapper: Wrapper, ...options }),
    queryClient,
  };
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
