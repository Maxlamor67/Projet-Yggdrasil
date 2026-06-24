import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateAndTimePicker } from '@/components/DateAndTimePicker';

describe('DateAndTimePicker', () => {
  const defaultProps = {
    value: undefined,
    onChange: vi.fn(),
  };

  it('devrait afficher les labels par défaut', () => {
    render(<DateAndTimePicker {...defaultProps} />);

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Heure')).toBeInTheDocument();
  });

  it('devrait afficher le placeholder par défaut', () => {
    render(<DateAndTimePicker {...defaultProps} />);

    expect(screen.getByText('Sélectionner une date')).toBeInTheDocument();
  });

  it('devrait afficher des labels personnalisés', () => {
    render(
      <DateAndTimePicker
        {...defaultProps}
        dateLabel="Date de début"
        timeLabel="Heure de début"
      />
    );

    expect(screen.getByText('Date de début')).toBeInTheDocument();
    expect(screen.getByText('Heure de début')).toBeInTheDocument();
  });

  it('devrait afficher un placeholder personnalisé', () => {
    render(
      <DateAndTimePicker
        {...defaultProps}
        placeholder="Choisir une date"
      />
    );

    expect(screen.getByText('Choisir une date')).toBeInTheDocument();
  });

  it('devrait afficher la date formatée quand une valeur est fournie', () => {
    const testDate = new Date(2024, 0, 15, 14, 30); // 15 janvier 2024, 14:30

    render(<DateAndTimePicker {...defaultProps} value={testDate} />);

    // La date devrait être affichée (format français par défaut)
    expect(screen.getByText(/15 janvier 2024/)).toBeInTheDocument();
  });

  it('devrait désactiver le champ heure quand aucune date n\'est sélectionnée', () => {
    render(<DateAndTimePicker {...defaultProps} />);

    const timeInput = screen.getByLabelText('Heure');
    expect(timeInput).toBeDisabled();
  });

  it('devrait activer le champ heure quand une date est sélectionnée', () => {
    const testDate = new Date(2024, 0, 15, 14, 30);

    render(<DateAndTimePicker {...defaultProps} value={testDate} />);

    const timeInput = screen.getByLabelText('Heure');
    expect(timeInput).not.toBeDisabled();
  });

  it('devrait afficher l\'heure formatée dans l\'input', () => {
    const testDate = new Date(2024, 0, 15, 14, 30); // 14:30

    render(<DateAndTimePicker {...defaultProps} value={testDate} />);

    const timeInput = screen.getByLabelText('Heure') as HTMLInputElement;
    expect(timeInput.value).toBe('14:30');
  });

  it('devrait désactiver les deux champs quand disabled est true', () => {
    const testDate = new Date(2024, 0, 15, 14, 30);

    render(
      <DateAndTimePicker
        {...defaultProps}
        value={testDate}
        disabled={true}
      />
    );

    const dateButton = screen.getByRole('button');
    const timeInput = screen.getByLabelText('Heure');

    expect(dateButton).toBeDisabled();
    expect(timeInput).toBeDisabled();
  });

  it('devrait appeler onChange quand l\'heure change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const testDate = new Date(2024, 0, 15, 14, 30);

    render(
      <DateAndTimePicker
        {...defaultProps}
        value={testDate}
        onChange={onChange}
      />
    );

    const timeInput = screen.getByLabelText('Heure');
    await user.clear(timeInput);
    await user.type(timeInput, '16:45');

    expect(onChange).toHaveBeenCalled();
  });

  it('devrait afficher le message "Sélectionnez d\'abord une date" quand aucune date n\'est choisie', () => {
    render(<DateAndTimePicker {...defaultProps} />);

    expect(screen.getByText("Sélectionnez d'abord une date")).toBeInTheDocument();
  });

  it('devrait ouvrir le calendrier au clic sur le bouton', async () => {
    const user = userEvent.setup();
    render(<DateAndTimePicker {...defaultProps} />);

    const dateButton = screen.getByRole('button');
    await user.click(dateButton);

    // Le calendrier devrait être visible (on vérifie la présence de la grille)
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('devrait utiliser l\'ID fourni pour les champs', () => {
    const testDate = new Date(2024, 0, 15, 14, 30);

    render(
      <DateAndTimePicker
        {...defaultProps}
        value={testDate}
        id="custom-picker"
      />
    );

    expect(screen.getByLabelText('Date')).toHaveAttribute('id', 'custom-picker-date');
    expect(screen.getByLabelText('Heure')).toHaveAttribute('id', 'custom-picker-time');
  });

  it('devrait afficher les secondes quand showSeconds est true', () => {
    const testDate = new Date(2024, 0, 15, 14, 30, 45); // 14:30:45

    render(
      <DateAndTimePicker
        {...defaultProps}
        value={testDate}
        showSeconds={true}
      />
    );

    const timeInput = screen.getByLabelText('Heure') as HTMLInputElement;
    expect(timeInput.value).toBe('14:30:45');
  });

  it('devrait ne pas afficher les secondes par défaut', () => {
    const testDate = new Date(2024, 0, 15, 14, 30, 45); // 14:30:45

    render(<DateAndTimePicker {...defaultProps} value={testDate} />);

    const timeInput = screen.getByLabelText('Heure') as HTMLInputElement;
    expect(timeInput.value).toBe('14:30');
  });
});
