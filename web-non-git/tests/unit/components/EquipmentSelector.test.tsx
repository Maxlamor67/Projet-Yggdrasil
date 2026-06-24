import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EquipmentSelector from '@/components/EquipmentSelector';
import type { GetSafetyEquipmentTypeResponse } from '@/api';

describe('EquipmentSelector', () => {
  const mockSafetyEquipmentTypes: GetSafetyEquipmentTypeResponse[] = [
    {
      id: '1',
      name: 'Barrière',
      model: 'OBSTACLE',
      createdAt: '2026-01-01T00:00:00.000Z',
      lengths: [
        { id: 'len-1', length: 10, safetyEquipmentTypeId: '1', createdAt: '2026-01-01T00:00:00.000Z' },
        { id: 'len-2', length: 20, safetyEquipmentTypeId: '1', createdAt: '2026-01-01T00:00:00.000Z' },
      ],
    },
    {
      id: '2',
      name: 'Clôture',
      model: 'OBSTACLE',
      createdAt: '2026-01-01T00:00:00.000Z',
      lengths: [
        { id: 'len-3', length: 5, safetyEquipmentTypeId: '2', createdAt: '2026-01-01T00:00:00.000Z' },
        { id: 'len-4', length: 15, safetyEquipmentTypeId: '2', createdAt: '2026-01-01T00:00:00.000Z' },
      ],
    },
  ];

  const defaultProps = {
    safetyEquipmentTypes: mockSafetyEquipmentTypes,
    selectedSafetyEquipmentTypeLengthId: null,
    onEquipmentChange: vi.fn(),
    disabled: false,
  };

  it('devrait afficher le placeholder par défaut', () => {
    render(<EquipmentSelector {...defaultProps} />);
    expect(screen.getByText("Type d'équipement")).toBeInTheDocument();
  });

  it('devrait afficher la valeur sélectionnée', () => {
    render(
      <EquipmentSelector
        {...defaultProps}
        selectedSafetyEquipmentTypeLengthId="len-2"
      />
    );

    expect(screen.getByText('Barrière — 20m')).toBeInTheDocument();
  });

  it('devrait être désactivé quand disabled est true', () => {
    render(<EquipmentSelector {...defaultProps} disabled={true} />);

    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeDisabled();
  });

  it('devrait gérer une liste vide d\'équipements', () => {
    render(
      <EquipmentSelector
        {...defaultProps}
        safetyEquipmentTypes={[]}
      />
    );

    expect(screen.getByText("Type d'équipement")).toBeInTheDocument();
  });

  it('devrait avoir un combobox', () => {
    render(<EquipmentSelector {...defaultProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('devrait accepter un onChange handler', () => {
    const onEquipmentChange = vi.fn();

    render(
      <EquipmentSelector
        {...defaultProps}
        onEquipmentChange={onEquipmentChange}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('devrait afficher la première valeur sélectionnée', () => {
    render(
      <EquipmentSelector
        {...defaultProps}
        selectedSafetyEquipmentTypeLengthId="len-1"
      />
    );

    expect(screen.getByText('Barrière — 10m')).toBeInTheDocument();
  });
});
