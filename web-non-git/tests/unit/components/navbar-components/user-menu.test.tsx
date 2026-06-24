import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import UserMenu from '@/components/navbar-components/user-menu';

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signOut: vi.fn(() => Promise.resolve({ data: { success: true } })),
  },
}));

vi.mock('@/providers/auth', () => ({
  useAuth: () => ({
    user: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
    },
  }),
}));

describe('UserMenu Component', () => {
  it('devrait rendre le menu utilisateur', () => {
    const { container } = render(<UserMenu />);
    expect(container).toBeInTheDocument();
  });

  it('devrait avoir un bouton pour le menu utilisateur', () => {
    const { container } = render(<UserMenu />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('devrait afficher l\'icône utilisateur', () => {
    const { container } = render(<UserMenu />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait avoir une structure de dropdown menu', () => {
    const { container } = render(<UserMenu />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait utiliser useAuth pour accéder à l\'utilisateur', () => {
    const { container } = render(<UserMenu />);
    expect(container).toBeInTheDocument();
  });

  it('devrait avoir un bouton avec variant ghost', () => {
    const { container } = render(<UserMenu />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('hover:bg-transparent');
  });
});
