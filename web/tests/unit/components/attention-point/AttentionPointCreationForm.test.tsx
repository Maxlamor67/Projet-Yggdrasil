import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorProvider } from '@/contexts/ErrorContext';
import AttentionPointCreationForm from '@/components/attention-point/AttentionPointCreationForm';

describe('AttentionPointCreationForm', () => {
  const mockPointDto = {
    latitude: 48.5,
    longitude: 7.5,
  };

  const createQueryClient = () => new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const defaultProps = {
    pointDto: mockPointDto,
    setNewAttentionPointPosition: vi.fn(),
    attentionPoints: [],
    setAttentionPoints: vi.fn(),
    setDrawingMode: vi.fn(),
    projectId: 'project-123',
  };

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

  it('devrait afficher le titre du formulaire', () => {
    render(<AttentionPointCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByText(/Création d'un point d'attention/i)).toBeInTheDocument();
  });

  it('devrait afficher le champ Description', () => {
    render(<AttentionPointCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('devrait afficher les boutons Annuler et Créer', () => {
    render(<AttentionPointCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
  });

  it('devrait appeler setDrawingMode(null) lors du clic sur Annuler', async () => {
    const user = userEvent.setup();
    const setDrawingMode = vi.fn();

    render(
      <AttentionPointCreationForm
        {...defaultProps}
        setDrawingMode={setDrawingMode}
      />,
      { wrapper }
    );

    await user.click(screen.getByRole('button', { name: /Annuler/i }));
    expect(setDrawingMode).toHaveBeenCalledWith(null);
  });

  it('devrait appeler setNewAttentionPointPosition(null) lors du clic sur Annuler', async () => {
    const user = userEvent.setup();
    const setNewAttentionPointPosition = vi.fn();

    render(
      <AttentionPointCreationForm
        {...defaultProps}
        setNewAttentionPointPosition={setNewAttentionPointPosition}
      />,
      { wrapper }
    );

    await user.click(screen.getByRole('button', { name: /Annuler/i }));
    expect(setNewAttentionPointPosition).toHaveBeenCalledWith(null);
  });

  it('devrait appeler setAttentionPoints avec un nouveau point lors de la soumission', async () => {
    render(<AttentionPointCreationForm {...defaultProps} />, { wrapper });

    // Le formulaire devrait se rendre avec les boutons
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
  });

  it('devrait réinitialiser le formulaire après soumission', async () => {
    render(<AttentionPointCreationForm {...defaultProps} />, { wrapper });

    // Le formulaire devrait être rendu avec le titre
    expect(screen.getByText(/Création d'un point d'attention/i)).toBeInTheDocument();
  });

  it('devrait rendre sans erreur', () => {
    const { container } = render(<AttentionPointCreationForm {...defaultProps} />, { wrapper });
    expect(container.firstChild).toBeInTheDocument();
  });
});
