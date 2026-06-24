import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Testnavbar from '@/components/Testnavbar';

describe('Testnavbar', () => {
  it('devrait afficher les liens par défaut', () => {
    render(<Testnavbar />);

    expect(screen.getByText('Éditeur')).toBeInTheDocument();
    expect(screen.getByText('Gestion des projets')).toBeInTheDocument();
    expect(screen.getByText('Gestion du personnel')).toBeInTheDocument();
  });

  it('devrait afficher les liens en mode default', () => {
    render(<Testnavbar mode="default" />);

    expect(screen.getByText('Éditeur')).toBeInTheDocument();
  });

  it('devrait afficher les liens en mode admin', () => {
    render(<Testnavbar mode="admin" />);

    expect(screen.getByText('Administration')).toBeInTheDocument();
    expect(screen.getByText('Utilisateurs')).toBeInTheDocument();
  });

  it('devrait utiliser les liens par défaut pour un mode inconnu', () => {
    render(<Testnavbar mode="unknown" />);

    expect(screen.getByText('Éditeur')).toBeInTheDocument();
  });

  it('devrait rendre le NavigationMenu', () => {
    const { container } = render(<Testnavbar />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait afficher 3 items en mode default', () => {
    render(<Testnavbar />);

    const triggers = screen.getAllByText(/Éditeur|Gestion/);
    expect(triggers.length).toBeGreaterThanOrEqual(3);
  });

  it('devrait afficher 2 items en mode admin', () => {
    render(<Testnavbar mode="admin" />);

    const adminText = screen.getByText('Administration');
    const usersText = screen.getByText('Utilisateurs');

    expect(adminText).toBeInTheDocument();
    expect(usersText).toBeInTheDocument();
  });
});
