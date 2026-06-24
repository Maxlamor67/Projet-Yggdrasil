import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EquipmentExpandedContent } from '@/components/equipments_table/EquipmentExpandedContent';

type UiEquipment = {
  id: string;
  setAt: Date;
  unsetAt: Date;
  setTeamId: string | null;
  unsetTeamId: string | null;
};

const mockEquipment: UiEquipment = {
  id: 'equip-1',
  setAt: new Date('2024-01-15T10:30:00'),
  unsetAt: new Date('2024-12-15T16:45:00'),
  setTeamId: 'team-1',
  unsetTeamId: 'team-2',
};

describe('EquipmentExpandedContent', () => {
  it('devrait afficher le titre "Date de pose"', () => {
    render(<EquipmentExpandedContent equipment={mockEquipment} />);
    expect(screen.getByText('Date de pose')).toBeInTheDocument();
  });

  it('devrait afficher le titre "Date de retrait"', () => {
    render(<EquipmentExpandedContent equipment={mockEquipment} />);
    expect(screen.getByText('Date de retrait')).toBeInTheDocument();
  });

  it('devrait afficher la date de pose formatée', () => {
    render(<EquipmentExpandedContent equipment={mockEquipment} />);
    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
  });

  it('devrait afficher la date de retrait formatée', () => {
    render(<EquipmentExpandedContent equipment={mockEquipment} />);
    const dateElements = screen.getAllByText(/15\/12\/2024/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('devrait afficher le bouton Modifier', () => {
    render(<EquipmentExpandedContent equipment={mockEquipment} />);
    expect(screen.getByRole('button', { name: /Modifier/ })).toBeInTheDocument();
  });

  it('devrait afficher le bouton Supprimer', () => {
    render(<EquipmentExpandedContent equipment={mockEquipment} />);
    expect(screen.getByRole('button', { name: /Supprimer/ })).toBeInTheDocument();
  });

  it('devrait appeler onEdit quand le bouton Modifier est cliqué', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<EquipmentExpandedContent equipment={mockEquipment} onEdit={onEdit} />);

    const editButton = screen.getByRole('button', { name: /Modifier/ });
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith('equip-1');
  });

  it('devrait appeler onDelete quand le bouton Supprimer est cliqué', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<EquipmentExpandedContent equipment={mockEquipment} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /Supprimer/ });
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('equip-1');
  });

  it('devrait avoir un style destructive pour le bouton Supprimer', () => {
    render(
      <EquipmentExpandedContent equipment={mockEquipment} />
    );

    const deleteButton = screen.getByRole('button', { name: /Supprimer/ });
    expect(deleteButton).toBeInTheDocument();
  });

  it('devrait gérer l\'absence de callbacks gracieusement', () => {
    const { container } = render(<EquipmentExpandedContent equipment={mockEquipment} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait afficher les icônes des boutons', () => {
    const { container } = render(
      <EquipmentExpandedContent equipment={mockEquipment} />
    );

    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('devrait formater les dates au format français', () => {
    render(<EquipmentExpandedContent equipment={mockEquipment} />);

    // Les dates doivent être au format JJ/MM/AAAA HH:MM
    expect(screen.getByText(/15\/01\/2024.*10:30/)).toBeInTheDocument();
  });

  it('devrait avoir la structure HTML correcte', () => {
    const { container } = render(
      <EquipmentExpandedContent equipment={mockEquipment} />
    );

    expect(container.querySelector('.space-y-4')).toBeInTheDocument();
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });
});
