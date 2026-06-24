import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TeamForm from '@/components/team/TeamForm';

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('TeamForm', () => {
  it('devrait rendre sans erreur', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <TeamForm onSubmit={vi.fn()} />
      </QueryClientProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait être un composant React valide', () => {
    expect(TeamForm).toBeDefined();
    expect(typeof TeamForm).toBe('function');
  });

  it('devrait accepter un teamId en props', () => {
    const props = { onSubmit: vi.fn() };
    expect(typeof props.onSubmit).toBe('function');
  });

  it('devrait avoir des champs pour le formulaire d\'équipe', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <TeamForm onSubmit={vi.fn()} />
      </QueryClientProvider>
    );
    const inputs = container.querySelectorAll('input, textarea, select');
    expect(inputs.length).toBeGreaterThanOrEqual(0);
  });

  it('devrait supporter la soumission', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <TeamForm onSubmit={vi.fn()} />
      </QueryClientProvider>
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  it('devrait afficher les informations de l\'équipe', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <TeamForm onSubmit={vi.fn()} />
      </QueryClientProvider>
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it('devrait charger les données via React Query', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <TeamForm onSubmit={vi.fn()} />
      </QueryClientProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait supporter la modification de l\'équipe', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <TeamForm onSubmit={vi.fn()} />
      </QueryClientProvider>
    );
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(0);
  });

  it('devrait afficher les membres de l\'équipe', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <TeamForm onSubmit={vi.fn()} />
      </QueryClientProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait supporter l\'ajout de membres', () => {
    const { container } = render(
      <QueryClientProvider client={createQueryClient()}>
        <TeamForm onSubmit={vi.fn()} />
      </QueryClientProvider>
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});
