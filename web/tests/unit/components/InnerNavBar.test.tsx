import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import InnerNavBar from '@/components/InnerNavBar';

// Mock useRouterState
vi.mock('@tanstack/react-router', () => ({
  useRouterState: () => ({
    location: {
      pathname: '/editor/project-1/map',
    },
  }),
}));

describe('InnerNavBar', () => {
  it('devrait afficher le lien Map', () => {
    render(<InnerNavBar />);
    expect(screen.getByText('Map')).toBeInTheDocument();
  });

  it('devrait afficher le lien Sync', () => {
    render(<InnerNavBar />);
    expect(screen.getByText('Sync avec le mobile')).toBeInTheDocument();
  });

  it('devrait afficher les icônes', () => {
    const { container } = render(<InnerNavBar />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('devrait avoir des liens de navigation', () => {
    render(<InnerNavBar />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('devrait avoir le bon href pour le lien Map', () => {
    render(<InnerNavBar />);
    const mapLink = screen.getByText('Map').closest('a');
    expect(mapLink).toHaveAttribute('href', '/editor/$projectId/map');
  });

  it('devrait avoir le bon href pour le lien Sync', () => {
    render(<InnerNavBar />);
    const syncLink = screen.getByText('Sync avec le mobile').closest('a');
    expect(syncLink).toHaveAttribute('href', '/editor/$projectId/app-connect');
  });

  it('devrait afficher le composant sans erreur', () => {
    const { container } = render(<InnerNavBar />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait afficher la structure header correcte', () => {
    const { container } = render(<InnerNavBar />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('border-b');
  });

  it('devrait centrer les éléments de navigation', () => {
    const { container } = render(<InnerNavBar />);
    const div = container.querySelector('.flex.h-16');
    expect(div).toHaveClass('justify-center');
  });

  it('devrait avoir un gap entre les éléments de navigation', () => {
    const { container } = render(<InnerNavBar />);
    const navList = container.querySelector('[class*="gap-"]');
    expect(navList).toBeInTheDocument();
  });

  it('devrait rendre avec les classes Tailwind correctes', () => {
    const { container } = render(<InnerNavBar />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('border-b', 'px-4');
  });
});
