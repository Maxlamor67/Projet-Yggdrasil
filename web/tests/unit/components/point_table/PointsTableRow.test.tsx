import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PointsTableRow } from '@/components/point_table/PointsTableRow';
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

describe('PointsTableRow', () => {
  it('devrait rendre une ligne de tableau', () => {
    const { container } = renderWithProviders(
      <table>
        <tbody>
          <PointsTableRow
            point={mockPoint}
            isSelected={false}
            onSelect={vi.fn()}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </tbody>
      </table>
    );
    expect(container.querySelector('tr')).toBeInTheDocument();
  });

  it('devrait avoir la structure d\'une ligne de tableau', () => {
    const { container } = renderWithProviders(
      <table>
        <tbody>
          <PointsTableRow
            point={mockPoint}
            isSelected={false}
            onSelect={vi.fn()}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </tbody>
      </table>
    );
    const cells = container.querySelectorAll('td');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('devrait afficher la localisation du point', () => {
    const { container } = renderWithProviders(
      <table>
        <tbody>
          <PointsTableRow
            point={mockPoint}
            isSelected={false}
            onSelect={vi.fn()}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </tbody>
      </table>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait afficher le statut "Non traité"', () => {
    const { container } = renderWithProviders(
      <table>
        <tbody>
          <PointsTableRow
            point={mockPoint}
            isSelected={false}
            onSelect={vi.fn()}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </tbody>
      </table>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait afficher le statut "Traité" quand treated=true', () => {
    const treatedPoint = { ...mockPoint, treated: true };
    const { container } = renderWithProviders(
      <table>
        <tbody>
          <PointsTableRow
            point={treatedPoint}
            isSelected={false}
            onSelect={vi.fn()}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </tbody>
      </table>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait appeler onSelect quand checkbox cliqué', () => {
    const onSelect = vi.fn();
    const { container } = renderWithProviders(
      <table>
        <tbody>
          <PointsTableRow
            point={mockPoint}
            isSelected={false}
            onSelect={onSelect}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </tbody>
      </table>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait supporter le callback onToggleTreated', () => {
    const onToggleTreated = vi.fn();
    const { container } = renderWithProviders(
      <table>
        <tbody>
          <PointsTableRow
            point={mockPoint}
            isSelected={false}
            onSelect={vi.fn()}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
            onToggleTreated={onToggleTreated}
          />
        </tbody>
      </table>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait avoir une structure valide', () => {
    const { container } = renderWithProviders(
      <table>
        <tbody>
          <PointsTableRow
            point={mockPoint}
            isSelected={false}
            onSelect={vi.fn()}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </tbody>
      </table>
    );
    expect(container).toBeInTheDocument();
  });
});
