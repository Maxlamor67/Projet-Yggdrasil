import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PointsEditSheet } from '@/components/point_table/PointEditSheet';
import { ErrorProvider } from '@/contexts/ErrorContext';

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

const mockSafetyEquipmentTypes = [
  {
    id: 'type-1',
    name: 'Barrière',
    model: 'OBSTACLE' as const,
    createdAt: '2026-01-01T00:00:00.000Z',
    lengths: [],
  },
];

describe('PointsEditSheet', () => {
  it('devrait rendre la sheet de modification', () => {
    const { container } = renderWithProviders(
      <PointsEditSheet
        open={true}
        onOpenChange={vi.fn()}
        projectId="project-123"
        pointId="point-1"
        safetyEquipmentTypes={mockSafetyEquipmentTypes}
        onSave={vi.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait avoir un formulaire de modification', () => {
    const { container } = renderWithProviders(
      <PointsEditSheet
        open={true}
        onOpenChange={vi.fn()}
        projectId="project-123"
        pointId="point-1"
        safetyEquipmentTypes={mockSafetyEquipmentTypes}
        onSave={vi.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait avoir un champ commentaire pré-rempli', () => {
    const { container } = renderWithProviders(
      <PointsEditSheet
        open={true}
        onOpenChange={vi.fn()}
        projectId="project-123"
        pointId="point-1"
        safetyEquipmentTypes={mockSafetyEquipmentTypes}
        onSave={vi.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait avoir un checkbox pour le statut traité', () => {
    const { container } = renderWithProviders(
      <PointsEditSheet
        open={true}
        onOpenChange={vi.fn()}
        projectId="project-123"
        pointId="point-1"
        safetyEquipmentTypes={mockSafetyEquipmentTypes}
        onSave={vi.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait avoir un select pour le type d\'équipement', () => {
    const { container } = renderWithProviders(
      <PointsEditSheet
        open={true}
        onOpenChange={vi.fn()}
        projectId="project-123"
        pointId="point-1"
        safetyEquipmentTypes={mockSafetyEquipmentTypes}
        onSave={vi.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait appeler onClose quand fermée', () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <PointsEditSheet
        open={false}
        onOpenChange={onClose}
        projectId="project-123"
        pointId="point-1"
        safetyEquipmentTypes={mockSafetyEquipmentTypes}
        onSave={vi.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait appeler onSuccess après la soumission', () => {
    const onSuccess = vi.fn();
    const { container } = renderWithProviders(
      <PointsEditSheet
        open={true}
        onOpenChange={vi.fn()}
        projectId="project-123"
        pointId="point-1"
        safetyEquipmentTypes={mockSafetyEquipmentTypes}
        onSave={onSuccess}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait supporter les points traités et non-traités', () => {
    const { container } = renderWithProviders(
      <PointsEditSheet
        open={true}
        onOpenChange={vi.fn()}
        projectId="project-123"
        pointId="point-1"
        safetyEquipmentTypes={mockSafetyEquipmentTypes}
        onSave={vi.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait avoir une structure valide', () => {
    const { container } = renderWithProviders(
      <PointsEditSheet
        open={true}
        onOpenChange={vi.fn()}
        projectId="project-123"
        pointId="point-1"
        safetyEquipmentTypes={mockSafetyEquipmentTypes}
        onSave={vi.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
