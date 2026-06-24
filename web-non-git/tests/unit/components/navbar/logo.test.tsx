import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Logo from '@/components/navbar-components/logo';

describe('Logo', () => {
  it('devrait rendre le SVG logo', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait avoir les dimensions correctes', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '33');
    expect(svg).toHaveAttribute('width', '33');
  });

  it('devrait contenir des paths', () => {
    const { container } = render(<Logo />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('devrait utiliser currentColor pour le fill', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('fill', 'currentColor');
  });
});
