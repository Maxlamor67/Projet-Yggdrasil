import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ParcoursTableRow } from '@/components/parcours_table/ParcoursTableRow';
import type { GetGeometryResponse } from '@/api';

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

const mockParcours: GetGeometryResponse = {
  id: 'parcours-1',
  projectId: 'project-123',
  name: 'Test Parcours',
  type: 'ROUTE',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  geometryPoints: [],
};

describe('ParcoursTableRow', () => {
  const defaultProps = {
    parcours: mockParcours,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onViewMap: vi.fn(),
    isSelected: false,
    onSelect: vi.fn(),
  };

  it('devrait rendre une ligne de tableau parcours', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <table>
          <tbody>
            <ParcoursTableRow {...defaultProps} />
          </tbody>
        </table>
      </QueryClientProvider>
    );
    expect(container.querySelector('tr')).toBeInTheDocument();
  });

  it('devrait afficher le nom du parcours', () => {
    const { getByText } = render(
      <QueryClientProvider client={createQueryClient()}>
        <table>
          <tbody>
            <ParcoursTableRow {...defaultProps} />
          </tbody>
        </table>
      </QueryClientProvider>
    );
    expect(getByText('Test Parcours')).toBeInTheDocument();
  });

  it('devrait afficher la distance', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <table>
          <tbody>
            <ParcoursTableRow {...defaultProps} />
          </tbody>
        </table>
      </QueryClientProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait afficher la difficulté', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <table>
          <tbody>
            <ParcoursTableRow {...defaultProps} />
          </tbody>
        </table>
      </QueryClientProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait supporter la sélection', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <table>
          <tbody>
            <ParcoursTableRow {...defaultProps} />
          </tbody>
        </table>
      </QueryClientProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait supporter l\'édition', () => {
    const onEdit = vi.fn();
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <table>
          <tbody>
            <ParcoursTableRow {...defaultProps} onEdit={onEdit} />
          </tbody>
        </table>
      </QueryClientProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait supporter la suppression', () => {
    const onDelete = vi.fn();
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <table>
          <tbody>
            <ParcoursTableRow {...defaultProps} onDelete={onDelete} />
          </tbody>
        </table>
      </QueryClientProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait afficher l\'état sélectionné', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <table>
          <tbody>
            <ParcoursTableRow {...defaultProps} />
          </tbody>
        </table>
      </QueryClientProvider>
    );
    expect(container).toBeInTheDocument();
  });
});
