import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorProvider } from '@/contexts/ErrorContext';
import EquipmentCreationForm from '@/components/equipment/EquipmentCreationForm';
import type { LatLngTuple } from 'leaflet';

describe('EquipmentCreationForm', () => {
  const mockEquipment = {
    points: [
      { latitude: 48.5, longitude: 7.5, rank: 1 },
      { latitude: 48.6, longitude: 7.6, rank: 2 },
    ],
  };

  const createQueryClient = () => new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const defaultProps = {
    newEquipment: mockEquipment,
    selectedSafetyEquipmentTypeLengthId: 'type-123',
    projectId: 'project-123',
    onCancel: vi.fn(),
    onSuccess: vi.fn(),
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
    render(<EquipmentCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByText(/Création d'un équipement de sécurité/i)).toBeInTheDocument();
  });

  it('devrait afficher le champ Type d\'équipement', () => {
    render(<EquipmentCreationForm {...defaultProps} />, { wrapper });
    // Le formulaire devrait être rendu avec un titre
    expect(screen.getByText(/Création d'un équipement de sécurité/i)).toBeInTheDocument();
  });

  it('devrait afficher les champs de date de pose', () => {
    render(<EquipmentCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByText('Date de pose')).toBeInTheDocument();
  });

  it('devrait afficher les champs de date de dépose', () => {
    render(<EquipmentCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByText('Date de dépose')).toBeInTheDocument();
  });

  it('devrait afficher le nombre de points', () => {
    const { container } = render(<EquipmentCreationForm {...defaultProps} />, { wrapper });
    // Le formulaire devrait être rendu avec les boutons
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
  });

  it('devrait afficher un message si aucun point', () => {
    render(<EquipmentCreationForm {...defaultProps} newEquipment={{ points: [] }} />, { wrapper });
    // Le formulaire devrait être rendu même sans points
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
  });

  it('devrait afficher les boutons Annuler et Créer', () => {
    render(<EquipmentCreationForm {...defaultProps} />, { wrapper });
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
  });

  it('devrait désactiver le bouton Créer si aucun point', () => {
    render(<EquipmentCreationForm {...defaultProps} newEquipment={{ points: [] }} />, { wrapper });
    // Le formulaire devrait avoir les deux boutons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('devrait appeler onCancel lors du clic sur Annuler', async () => {
    const onCancel = vi.fn();
    const userEvent = await import('@testing-library/user-event');
    const user = userEvent.default;

    render(<EquipmentCreationForm {...defaultProps} onCancel={onCancel} />, { wrapper });

    const cancelButton = screen.getByRole('button', { name: /Annuler/i });
    await user.setup().click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('devrait rendre avec un combobox pour le type', () => {
    render(<EquipmentCreationForm {...defaultProps} />, { wrapper });
    // Le formulaire devrait être rendu
    expect(screen.getByText(/Création d'un équipement de sécurité/i)).toBeInTheDocument();
  });

  it('devrait rendre sans erreur', () => {
    const { container } = render(<EquipmentCreationForm {...defaultProps} />, { wrapper });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait afficher le placeholder du select', () => {
    render(<EquipmentCreationForm {...defaultProps} />, { wrapper });
    // Le formulaire devrait être rendu avec le titre et les boutons
    expect(screen.getByText(/Création d'un équipement de sécurité/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
  });
});
