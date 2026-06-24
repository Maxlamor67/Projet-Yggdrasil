import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorProvider } from '@/contexts/ErrorContext';
import RouteCreationForm from '@/components/route/RouteCreationForm';

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        {children}
      </ErrorProvider>
    </QueryClientProvider>
  );
};

describe('RouteCreationForm', () => {
  const mockPoints = [
    [48.5, 7.5],
    [48.6, 7.6],
  ];

  const defaultProps = {
    onFinish: vi.fn(),
    points: mockPoints as [number, number][],
    projectId: 'project-123',
  };

  it('devrait afficher le titre du formulaire', () => {
    render(<RouteCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByText(/Création d'un parcours/i)).toBeInTheDocument();
  });

  it('devrait afficher les champs de date et heure', () => {
    render(<RouteCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByText('Date et heure de début')).toBeInTheDocument();
  });

  it('devrait afficher le champ vitesse lente', () => {
    render(<RouteCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByText(/Vitesse du participant le plus lent/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: 8')).toBeInTheDocument();
  });

  it('devrait afficher le champ vitesse rapide', () => {
    render(<RouteCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByText(/Vitesse du participant le plus rapide/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: 15')).toBeInTheDocument();
  });

  it('devrait afficher les boutons Annuler et Créer', () => {
    render(<RouteCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
  });

  it('devrait appeler onFinish lors du clic sur Annuler', async () => {
    const onFinish = vi.fn();
    const userEvent = await import('@testing-library/user-event');
    const user = userEvent.default;

    render(<RouteCreationForm {...defaultProps} onFinish={onFinish} />, { wrapper });

    const cancelButton = screen.getByRole('button', { name: /Annuler/i });
    await user.setup().click(cancelButton);

    expect(onFinish).toHaveBeenCalled();
  });

  it('devrait avoir des inputs de type number pour les vitesses', () => {
    render(<RouteCreationForm {...defaultProps} />, { wrapper });

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('devrait avoir des inputs de date et time', () => {
    const { container } = render(<RouteCreationForm {...defaultProps} />, { wrapper });

    const dateInput = container.querySelector('input[type="date"]');
    const timeInput = container.querySelector('input[type="time"]');

    expect(dateInput).toBeInTheDocument();
    expect(timeInput).toBeInTheDocument();
  });

  it('devrait rendre sans erreur', () => {
    const { container } = render(<RouteCreationForm {...defaultProps} />, { wrapper });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait avoir les champs required', () => {
    const { container } = render(<RouteCreationForm {...defaultProps} />, { wrapper });

    const requiredInputs = container.querySelectorAll('[required]');
    expect(requiredInputs.length).toBeGreaterThan(0);
  });
});
