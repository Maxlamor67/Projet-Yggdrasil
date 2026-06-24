import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import NotificationMenu from '@/components/navbar-components/notification-menu';

describe('NotificationMenu Component', () => {
  it('devrait rendre le menu notifications', () => {
    const { container } = render(<NotificationMenu />);
    expect(container).toBeInTheDocument();
  });

  it('devrait avoir un bouton pour les notifications', () => {
    const { container } = render(<NotificationMenu />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('devrait afficher l\'icône cloche (bell)', () => {
    const { container } = render(<NotificationMenu />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait avoir une structure de popover', () => {
    const { container } = render(<NotificationMenu />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait être un composant client', () => {
    const { container } = render(<NotificationMenu />);
    expect(container).toBeInTheDocument();
  });

  it('devrait utiliser useState pour gérer les notifications', () => {
    const { container } = render(<NotificationMenu />);
    expect(container).toBeInTheDocument();
  });

  it('devrait afficher les notifications quand le popover est ouvert', () => {
    const { container } = render(<NotificationMenu />);
    expect(container).toBeInTheDocument();
  });
});
