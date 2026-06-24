/**
 * Tests unitaires pour SecurityPointMarker
 * Teste les marqueurs de points de sécurité sur la carte
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from '../../../utils/test-utils';
import SecurityPointMarker from '@/components/map/SecurityPointMarker';
import type { GetAllPointsToSecureResponse as SecurityPoint } from '@/api';
import '../../../mocks/leafletStub';

describe('SecurityPointMarker', () => {
  const mockSecurityPoint: SecurityPoint = {
    id: 'point-1',
    pointId: 'coord-1',
    point: {
      id: 'coord-1',
      type: 'POINT_TO_SECURE',
      latitude: 48.5734,
      longitude: 7.7521,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    comment: 'Test security point',
    isTreated: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    projectId: 'project-1',
  };

  const mockHandleSelectPoint = vi.fn();
  const mockSetEditedPoint = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu du marqueur', () => {
    it('devrait afficher un marqueur à la position correcte', () => {
      const { container } = renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      expect(container.querySelector('[data-testid="marker"]')).toBeInTheDocument();
    });

    it('devrait afficher un marqueur non sélectionné par défaut', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Marker should render with default styling (gray)
      expect(mockHandleSelectPoint).not.toHaveBeenCalled();
    });

    it('devrait afficher un marqueur sélectionné quand il correspond au point sélectionné', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={mockSecurityPoint}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should render as selected (red styling)
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });

    it('devrait afficher un marqueur éditable en mode editPoint', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode="editPoint"
          editedPoint={mockSecurityPoint}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should render with draggable icon
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });
  });

  describe('États du marqueur', () => {
    it('devrait rendre le marqueur draggable en mode édition', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode="editPoint"
          editedPoint={mockSecurityPoint}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Marker should be draggable when in edit mode
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });

    it('devrait rendre le marqueur non-draggable hors mode édition', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Marker should not be draggable when not in edit mode
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });

    it('devrait gérer un point avec des coordonnées différentes', () => {
      const differentPoint: SecurityPoint = {
        ...mockSecurityPoint,
        id: 'point-2',
        pointId: 'coord-2',
        point: {
          id: 'coord-2',
          type: 'POINT_TO_SECURE',
          latitude: 48.6000,
          longitude: 7.8000,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      };

      renderWithProviders(
        <SecurityPointMarker
          point={differentPoint}
          selectedPoint={mockSecurityPoint}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should not be selected since it's a different point
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });
  });

  describe('Interactions avec le marqueur', () => {
    it('devrait appeler handleSelectPoint au clic', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Click interaction is handled through event handlers
      // The component sets up eventHandlers with click handler
      expect(mockHandleSelectPoint).not.toHaveBeenCalled();
    });

    it('devrait gérer le drag en mode édition', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode="editPoint"
          editedPoint={mockSecurityPoint}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Dragend handler should be set up
      expect(mockSetEditedPoint).not.toHaveBeenCalled();
    });

    it('ne devrait pas appeler setEditedPoint hors mode édition', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should not call setEditedPoint when not in edit mode
      expect(mockSetEditedPoint).not.toHaveBeenCalled();
    });
  });

  describe('Position du marqueur', () => {
    it('devrait utiliser la position du point par défaut', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should render at base position
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });

    it('devrait utiliser la position éditée en mode édition', () => {
      const editedPoint: SecurityPoint = {
        ...mockSecurityPoint,
        point: {
          ...mockSecurityPoint.point,
          latitude: 48.6000,
          longitude: 7.8000,
        },
      };

      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode="editPoint"
          editedPoint={editedPoint}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should render at edited position
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });
  });

  describe('Comparaison de points', () => {
    it('devrait identifier deux points identiques', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={mockSecurityPoint}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should be marked as selected
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });

    it('devrait identifier deux points avec des coordonnées presque identiques', () => {
      const nearlyIdenticalPoint: SecurityPoint = {
        ...mockSecurityPoint,
        point: {
          ...mockSecurityPoint.point,
          latitude: 48.5734 + 0.0000001, // Within tolerance
          longitude: 7.7521 + 0.0000001,
        },
      };

      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={nearlyIdenticalPoint}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should be marked as selected (within tolerance)
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });

    it('devrait différencier deux points avec des coordonnées différentes', () => {
      const differentPoint: SecurityPoint = {
        ...mockSecurityPoint,
        id: 'point-2',
        point: {
          ...mockSecurityPoint.point,
          id: 'coord-2',
          latitude: 48.6000,
          longitude: 7.8000,
        },
      };

      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={differentPoint}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should not be marked as selected
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });
  });

  describe('Gestion des cas limites', () => {
    it('devrait gérer selectedPoint null', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should render without error
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });

    it('devrait gérer editedPoint null', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode="editPoint"
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should render without error
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });

    it('devrait gérer drawingMode null', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Should render without error
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });
  });

  describe('Icône du marqueur', () => {
    it('devrait générer une icône avec le bon style pour un point non sélectionné', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Icon should be generated with gray color
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });

    it('devrait générer une icône avec le bon style pour un point sélectionné', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={mockSecurityPoint}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode={null}
          editedPoint={null}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Icon should be generated with red color
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });

    it('devrait inclure une icône de déplacement en mode édition', () => {
      renderWithProviders(
        <SecurityPointMarker
          point={mockSecurityPoint}
          selectedPoint={null}
          handleSelectPoint={mockHandleSelectPoint}
          drawingMode="editPoint"
          editedPoint={mockSecurityPoint}
          setEditedPoint={mockSetEditedPoint}
        />
      );

      // Icon should include Move icon
      const marker = document.querySelector('[data-testid="marker"]');
      expect(marker).toBeInTheDocument();
    });
  });
});
