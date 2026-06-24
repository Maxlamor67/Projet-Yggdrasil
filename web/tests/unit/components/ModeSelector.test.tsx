import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ModeSelector from '@/components/ModeSelector';

describe('ModeSelector', () => {
  const defaultProps = {
    selectedMode: null,
    onModeChange: vi.fn(),
    disabled: false,
  };

  it('devrait afficher le placeholder par défaut', () => {
    render(<ModeSelector {...defaultProps} />);
    expect(screen.getByText('Mode')).toBeInTheDocument();
  });

  it('devrait afficher la valeur sélectionnée - Parcours', () => {
    render(<ModeSelector {...defaultProps} selectedMode="course" />);
    expect(screen.getByText('Parcours')).toBeInTheDocument();
  });

  it('devrait afficher la valeur sélectionnée - Zone', () => {
    render(<ModeSelector {...defaultProps} selectedMode="area" />);
    expect(screen.getByText('Zone')).toBeInTheDocument();
  });

  it('devrait afficher la valeur sélectionnée - Points à sécuriser', () => {
    render(<ModeSelector {...defaultProps} selectedMode="point" />);
    expect(screen.getByText('Points à sécuriser')).toBeInTheDocument();
  });

  it('devrait afficher la valeur sélectionnée - Equipements', () => {
    render(<ModeSelector {...defaultProps} selectedMode="equipment" />);
    expect(screen.getByText('Equipements')).toBeInTheDocument();
  });

  it('devrait afficher la valeur sélectionnée - Points d\'attention', () => {
    render(<ModeSelector {...defaultProps} selectedMode="attentionPoint" />);
    expect(screen.getByText("Points d'attention")).toBeInTheDocument();
  });

  it('devrait être désactivé quand disabled est true', () => {
    render(<ModeSelector {...defaultProps} disabled={true} />);

    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeDisabled();
  });

  it('devrait avoir un combobox', () => {
    render(<ModeSelector {...defaultProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('devrait accepter un onChange handler', () => {
    const onModeChange = vi.fn();

    render(<ModeSelector {...defaultProps} onModeChange={onModeChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
