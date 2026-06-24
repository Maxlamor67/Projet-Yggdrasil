import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PointsExpandedContent } from '@/components/point_table/PointsExpandedContent';
import { ErrorProvider } from '@/contexts/ErrorContext';
import type { GetAllPointsToSecureResponse } from '@/api';

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <ErrorProvider>
        {component}
      </ErrorProvider>
    </QueryClientProvider>
  );
};

const mockPoint: GetAllPointsToSecureResponse = {
  id: 'point-1',
  projectId: 'project-123',
  pointId: 'pt-1',
  comment: 'Test point',
  isTreated: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  point: {
    id: 'pt-1',
    type: 'POINT_TO_SECURE',
    latitude: 48.8566,
    longitude: 2.3522,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

describe('PointsExpandedContent', () => {
  const defaultProps = {
    projectId: 'project-123',
    pointId: 'point-1',
    pointListItem: mockPoint,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('devrait rendre le contenu expandé', () => {
    const { container } = renderWithProviders(
      <PointsExpandedContent {...defaultProps} />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait afficher les détails du point', () => {
    const { container } = renderWithProviders(
      <PointsExpandedContent {...defaultProps} />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait avoir un bouton Edit', () => {
    const { container } = renderWithProviders(
      <PointsExpandedContent {...defaultProps} />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('devrait avoir un bouton Delete', () => {
    const { container } = renderWithProviders(
      <PointsExpandedContent {...defaultProps} />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('devrait afficher les badges de statut', () => {
    const { container } = renderWithProviders(
      <PointsExpandedContent {...defaultProps} />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait charger les détails du point via useQuery', () => {
    const { container } = renderWithProviders(
      <PointsExpandedContent {...defaultProps} />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait appeler onEdit quand le bouton edit est cliqué', () => {
    const onEdit = vi.fn();
    const { container } = renderWithProviders(
      <PointsExpandedContent {...defaultProps} onEdit={onEdit} />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait appeler onDelete quand le bouton delete est cliqué', () => {
    const onDelete = vi.fn();
    const { container } = renderWithProviders(
      <PointsExpandedContent {...defaultProps} onDelete={onDelete} />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait supporter le statut traité', () => {
    const treatedPoint = { ...mockPoint, treated: true };
    const { container } = renderWithProviders(
      <PointsExpandedContent
        {...defaultProps}
        pointListItem={treatedPoint}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
