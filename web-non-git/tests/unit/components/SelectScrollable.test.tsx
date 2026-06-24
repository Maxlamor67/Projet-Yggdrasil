import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SelectScrollable } from '@/components/SelectScrollable';

describe('SelectScrollable', () => {
  it('devrait afficher le placeholder par défaut', () => {
    render(<SelectScrollable />);
    expect(screen.getByText('Select a hour')).toBeInTheDocument();
  });

  it('devrait avoir un combobox', () => {
    render(<SelectScrollable />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('devrait rendre sans erreur', () => {
    const { container } = render(<SelectScrollable />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
