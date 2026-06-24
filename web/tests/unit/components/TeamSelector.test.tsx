import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TeamSelector from '@/components/TeamSelector';
import type { Team } from '@/api';

describe('TeamSelector', () => {
  const mockTeams: Team[] = [
    { id: 'team-1', name: 'Équipe Alpha', projectId: 'proj-1', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    { id: 'team-2', name: 'Équipe Beta', projectId: 'proj-1', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    { id: 'team-3', name: 'Équipe Gamma', projectId: 'proj-1', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  ];

  const defaultProps = {
    teams: mockTeams,
    selectedTeamId: null,
    onTeamChange: vi.fn(),
    disabled: false,
    placeholder: 'Sélectionner une équipe',
  };

  it('devrait afficher le placeholder', () => {
    render(<TeamSelector {...defaultProps} />);
    expect(screen.getByText('Sélectionner une équipe')).toBeInTheDocument();
  });

  it('devrait afficher un placeholder personnalisé', () => {
    render(
      <TeamSelector
        {...defaultProps}
        placeholder="Choisir votre équipe"
      />
    );
    expect(screen.getByText('Choisir votre équipe')).toBeInTheDocument();
  });

  it('devrait afficher l\'équipe sélectionnée', () => {
    render(
      <TeamSelector
        {...defaultProps}
        selectedTeamId="team-2"
      />
    );
    expect(screen.getByText('Équipe Beta')).toBeInTheDocument();
  });

  it('devrait être désactivé quand disabled est true', () => {
    render(<TeamSelector {...defaultProps} disabled={true} />);
    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeDisabled();
  });

  it('devrait gérer une liste vide d\'équipes', () => {
    render(
      <TeamSelector
        {...defaultProps}
        teams={[]}
      />
    );
    expect(screen.getByText('Sélectionner une équipe')).toBeInTheDocument();
  });

  it('devrait avoir un combobox', () => {
    render(<TeamSelector {...defaultProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('devrait accepter un onChange handler', () => {
    const onTeamChange = vi.fn();
    render(
      <TeamSelector
        {...defaultProps}
        onTeamChange={onTeamChange}
      />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
