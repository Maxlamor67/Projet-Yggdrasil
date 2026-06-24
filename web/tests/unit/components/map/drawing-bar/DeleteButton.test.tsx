import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteButton from '@/components/map/drawing-bar/DeleteButton';

describe('DeleteButton', () => {
  it('devrait afficher le bouton de suppression initial', () => {
    const deleteFunction = vi.fn();
    const { container } = render(<DeleteButton deleteFunction={deleteFunction} />);

    // Le bouton Trash2 devrait être présent
    const trashIcon = container.querySelector('svg');
    expect(trashIcon).toBeInTheDocument();
  });

  it('devrait afficher les boutons de confirmation après clic sur supprimer', async () => {
    const user = userEvent.setup();
    const deleteFunction = vi.fn();
    render(<DeleteButton deleteFunction={deleteFunction} />);

    // Cliquer sur le bouton de suppression
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    // Maintenant il devrait y avoir 2 boutons (annuler et confirmer)
    const confirmButtons = screen.getAllByRole('button');
    expect(confirmButtons).toHaveLength(2);
  });

  it('devrait appeler deleteFunction lors de la confirmation', async () => {
    const user = userEvent.setup();
    const deleteFunction = vi.fn();
    render(<DeleteButton deleteFunction={deleteFunction} />);

    // Cliquer sur le bouton de suppression
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    // Cliquer sur le bouton de confirmation (Check)
    const confirmButtons = screen.getAllByRole('button');
    await user.click(confirmButtons[1]); // Le deuxième bouton est Check

    expect(deleteFunction).toHaveBeenCalledTimes(1);
  });

  it('devrait revenir à l\'état initial après annulation', async () => {
    const user = userEvent.setup();
    const deleteFunction = vi.fn();
    render(<DeleteButton deleteFunction={deleteFunction} />);

    // Cliquer sur le bouton de suppression
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    // Cliquer sur le bouton d'annulation (CircleX)
    const confirmButtons = screen.getAllByRole('button');
    await user.click(confirmButtons[0]); // Le premier bouton est CircleX

    // Devrait revenir à un seul bouton (Trash2)
    const finalButtons = screen.getAllByRole('button');
    expect(finalButtons).toHaveLength(1);
    expect(deleteFunction).not.toHaveBeenCalled();
  });

  it('ne devrait pas appeler deleteFunction si annulé', async () => {
    const user = userEvent.setup();
    const deleteFunction = vi.fn();
    render(<DeleteButton deleteFunction={deleteFunction} />);

    // Cliquer sur le bouton de suppression
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    // Annuler
    const confirmButtons = screen.getAllByRole('button');
    await user.click(confirmButtons[0]);

    expect(deleteFunction).not.toHaveBeenCalled();
  });

  it('devrait revenir à l\'état initial après confirmation', async () => {
    const user = userEvent.setup();
    const deleteFunction = vi.fn();
    render(<DeleteButton deleteFunction={deleteFunction} />);

    // Cliquer sur le bouton de suppression
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    // Confirmer
    const confirmButtons = screen.getAllByRole('button');
    await user.click(confirmButtons[1]);

    // Devrait revenir à un seul bouton
    const finalButtons = screen.getAllByRole('button');
    expect(finalButtons).toHaveLength(1);
  });
});
