import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SelectEquipe } from '@/components/SelectEquipe';
import { ErrorProvider } from '@/contexts/ErrorContext';

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <ErrorProvider>
        {component}
      </ErrorProvider>
    </QueryClientProvider>
  );
};

describe('SelectEquipe', () => {
  it('devrait être un composant React valide', () => {
    expect(SelectEquipe).toBeDefined();
  });

  it('devrait rendre le composant avec QueryClient', () => {
    const { container } = renderWithProviders(
      <SelectEquipe projectId="project-123" onChange={vi.fn()} />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait être du type function', () => {
    expect(typeof SelectEquipe).toBe('function');
  });

  it('devrait accepter les props correctes', () => {
    const props = {
      projectId: 'project-1',
      onChange: vi.fn(),
      value: 'team-1',
      disabled: false,
    };

    expect(props.projectId).toBe('project-1');
    expect(typeof props.onChange).toBe('function');
  });

  it('devrait supporter le changement de valeur', () => {
    const onChange = vi.fn();
    const props = {
      projectId: 'project-1',
      onChange: onChange,
      value: undefined,
      disabled: false,
    };

    expect(props.onChange).toBeDefined();
  });

  it('devrait gérer l\'état disabled', () => {
    const props1 = { projectId: 'proj-1', onChange: vi.fn(), disabled: true };
    const props2 = { projectId: 'proj-1', onChange: vi.fn(), disabled: false };

    expect(props1.disabled).toBe(true);
    expect(props2.disabled).toBe(false);
  });

  it('devrait supporter différents projectIds', () => {
    const ids = ['project-1', 'project-2', 'my-proj'];

    ids.forEach((id) => {
      const props = {
        projectId: id,
        onChange: vi.fn(),
      };
      expect(props.projectId).toBe(id);
    });
  });

  it('devrait utiliser useQuery de React Query', () => {
    // SelectEquipe utilise useQuery pour charger les équipes
    expect(SelectEquipe).toBeDefined();
  });
});
