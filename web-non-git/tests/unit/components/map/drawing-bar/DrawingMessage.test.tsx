import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DrawingMessage from '@/components/map/drawing-bar/DrawingMessage';

describe('DrawingMessage', () => {
  it('devrait afficher un warning quand il est fourni', () => {
    render(<DrawingMessage warning="Test warning" drawingMode={null} />);
    expect(screen.getByText('Test warning')).toBeInTheDocument();
  });

  it('devrait afficher le mode Parcours', () => {
    render(<DrawingMessage warning={null} drawingMode="course" />);
    expect(screen.getByText('Mode Parcours')).toBeInTheDocument();
  });

  it('devrait afficher le mode Zone', () => {
    render(<DrawingMessage warning={null} drawingMode="area" />);
    expect(screen.getByText('Mode Zone')).toBeInTheDocument();
  });

  it('devrait afficher le mode Création point', () => {
    render(<DrawingMessage warning={null} drawingMode="createPoint" />);
    expect(screen.getByText('Mode Point (création)')).toBeInTheDocument();
  });

  it('devrait afficher le mode Édition point', () => {
    render(<DrawingMessage warning={null} drawingMode="editPoint" />);
    expect(screen.getByText('Mode Point (édition)')).toBeInTheDocument();
  });

  it('devrait afficher le mode tel quel si non reconnu', () => {
    render(<DrawingMessage warning={null} drawingMode="unknown" />);
    expect(screen.getByText('Mode unknown')).toBeInTheDocument();
  });

  it('devrait afficher l\'icône CircleAlert pour les warnings', () => {
    const { container } = render(<DrawingMessage warning="Warning!" drawingMode={null} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait avoir la classe text-yellow-500 pour les warnings', () => {
    const { container } = render(<DrawingMessage warning="Warning!" drawingMode={null} />);
    const warningDiv = container.querySelector('.text-yellow-500');
    expect(warningDiv).toBeInTheDocument();
  });

  it('ne devrait pas afficher de warning si null', () => {
    render(<DrawingMessage warning={null} drawingMode="course" />);
    expect(screen.queryByText(/warning/i)).not.toBeInTheDocument();
  });

  it('devrait afficher une icône pour le mode course', () => {
    const { container } = render(<DrawingMessage warning={null} drawingMode="course" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait afficher une icône pour le mode area', () => {
    const { container } = render(<DrawingMessage warning={null} drawingMode="area" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait afficher une icône pour le mode createPoint', () => {
    const { container } = render(<DrawingMessage warning={null} drawingMode="createPoint" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait afficher une icône pour le mode editPoint', () => {
    const { container } = render(<DrawingMessage warning={null} drawingMode="editPoint" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
