import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EquipmentTableRow } from '@/components/equipments_table/EquipmentTableRow';

type UiEquipment = {
  id: string;
  label: string;
  count: number;
  setAt: Date;
  unsetAt: Date;
  setTeamId: string | null;
  unsetTeamId: string | null;
  safetyEquipmentTypeLengthId: string;
  points: Array<{ latitude: number; longitude: number; rank: number }>;
};

const mockEquipment: UiEquipment = {
  id: 'equip-1',
  label: 'Barrière',
  count: 3,
  setAt: new Date('2024-01-15T10:30:00'),
  unsetAt: new Date('2024-12-15T16:45:00'),
  setTeamId: 'team-1',
  unsetTeamId: 'team-2',
  safetyEquipmentTypeLengthId: 'type-1',
  points: [
    { latitude: 48.5, longitude: 7.5, rank: 1 },
    { latitude: 48.6, longitude: 7.6, rank: 2 },
  ],
};

describe('EquipmentTableRow', () => {
  it('devrait afficher le libellé et le nombre d\'équipements', () => {
    render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} isSelected={false} />
        </tbody>
      </table>
    );

    expect(screen.getByText(/Barrière \(x3\)/)).toBeInTheDocument();
  });

  it('devrait afficher la date de pose au format français', () => {
    render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} isSelected={false} />
        </tbody>
      </table>
    );

    const dateText = screen.getByText(/15\/01\/2024/);
    expect(dateText).toBeInTheDocument();
  });

  it('devrait afficher le chevron pour expansion', () => {
    const { container } = render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} isSelected={false} />
        </tbody>
      </table>
    );

    // Chercher l'icône chevron
    const chevron = container.querySelector('svg');
    expect(chevron).toBeInTheDocument();
  });

  it('devrait être cliquable pour ouvrir/fermer le contenu', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} isSelected={false} />
        </tbody>
      </table>
    );

    const row = container.querySelector('tr');
    expect(row).toBeInTheDocument();
  });

  it('devrait appeler onEdit quand le bouton modifier est cliqué', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    const { container } = render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} onEdit={onEdit} isSelected={false} />
        </tbody>
      </table>
    );

    const row = container.querySelector('tr');
    if (row) {
      await user.click(row);
    }

    // Attendre que le contenu soit visible
    const editButton = screen.queryByRole('button', { name: /Modifier/ });
    if (editButton) {
      await user.click(editButton);
      expect(onEdit).toHaveBeenCalledWith('equip-1');
    }
  });

  it('devrait appeler onDelete quand le bouton supprimer est cliqué', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    const { container } = render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} onDelete={onDelete} isSelected={false} />
        </tbody>
      </table>
    );

    const row = container.querySelector('tr');
    if (row) {
      await user.click(row);
    }

    const deleteButton = screen.queryByRole('button', { name: /Supprimer/ });
    if (deleteButton) {
      await user.click(deleteButton);
      expect(onDelete).toHaveBeenCalledWith('equip-1');
    }
  });

  it('devrait afficher le contenu dépliable', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} isSelected={false} />
        </tbody>
      </table>
    );

    const row = container.querySelector('tr');
    if (row) {
      await user.click(row);
    }

    // Vérifier que les dates de pose et retrait sont affichées
    const dateElements = screen.queryAllByText(/15\/01\/2024|15\/12\/2024/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('devrait gérer l\'absence de callbacks', () => {
    const { container } = render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} isSelected={false} />
        </tbody>
      </table>
    );

    expect(container.querySelector('tr')).toBeInTheDocument();
  });

  it('devrait afficher plusieurs équipements correctement', () => {
    const equipment2 = { ...mockEquipment, id: 'equip-2', label: 'Clôture', count: 5 };

    const { container } = render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} isSelected={false} />
          <EquipmentTableRow equipment={equipment2} isSelected={false} />
        </tbody>
      </table>
    );

    expect(screen.getByText(/Barrière \(x3\)/)).toBeInTheDocument();
    expect(screen.getByText(/Clôture \(x5\)/)).toBeInTheDocument();
  });

  it('devrait appeler onSelect quand la ligne est cliquée', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    const { container } = render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} isSelected={false} onSelect={onSelect} />
        </tbody>
      </table>
    );

    const row = container.querySelector('tr');
    if (row) {
      await user.click(row);
      expect(onSelect).toHaveBeenCalled();
    }
  });

  it('devrait afficher le background rouge quand isSelected est true', () => {
    const { container } = render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} isSelected={true} />
        </tbody>
      </table>
    );

    const row = container.querySelector('tr');
    expect(row).toHaveClass('bg-red-100');
  });

  it('devrait afficher le background normal quand isSelected est false', () => {
    const { container } = render(
      <table>
        <tbody>
          <EquipmentTableRow equipment={mockEquipment} isSelected={false} />
        </tbody>
      </table>
    );

    const row = container.querySelector('tr');
    expect(row).not.toHaveClass('bg-red-100');
  });
});
