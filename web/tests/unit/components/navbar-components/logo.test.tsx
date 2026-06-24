import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Logo from '@/components/navbar-components/logo';

describe('Logo Component', () => {
  it('devrait rendre le logo SVG', () => {
    const { container } = render(<Logo />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('devrait avoir une taille de 33x33', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '33');
    expect(svg).toHaveAttribute('height', '33');
  });

  it('devrait utiliser currentColor', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('fill', 'currentColor');
  });

  it('devrait avoir des paths pour le logo', () => {
    const { container } = render(<Logo />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('devrait avoir le namespace SVG correct', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });
});
