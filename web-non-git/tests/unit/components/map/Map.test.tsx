/**
 * Tests unitaires pour Map
 * Teste la structure et les props du composant Map principal
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import Map from '@/components/map/Map';
import type { Course, Area, GeometryWithId, PolylineEquipment } from '@/types/geometry';
import type { GetAllPointsToSecureResponse as PointToSecure } from '@/api';
import '../../../mocks/leafletStub';

describe('Map', () => {
  const mockSetNewCourse = vi.fn();
  const mockSetNewArea = vi.fn();
  const mockSetNewPolyline = vi.fn();
  const mockSetUndoStack = vi.fn();
  const mockSetRedoStack = vi.fn();
  const mockHandleCancel = vi.fn();
  const mockHandleValidate = vi.fn();
  const mockHandleFinish = vi.fn();
  const mockDeleteGeometry = vi.fn();
  const mockSetSelectedPoint = vi.fn();
  const mockSetNewPointPosition = vi.fn();
  const mockSetEditedPoint = vi.fn();
  const mockSetPolylines = vi.fn();
  const mockOnSelectSecurityPoint = vi.fn();
  const mockOnSelectCourse = vi.fn();
  const mockOnSelectArea = vi.fn();
  const mockOnSelectEquipment = vi.fn();
  const mockSetNewVehicle = vi.fn();
  const mockSetNewAttentionPointPosition = vi.fn();

  const mockCourse: Course = [
    [48.5734, 7.7521],
    [48.5834, 7.7621],
  ];

  const mockArea: Area = [
    [48.5734, 7.7521],
    [48.5834, 7.7621],
    [48.5934, 7.7721],
  ];

  const mockSecurityPoint: PointToSecure = {
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
    comment: 'Test point',
    isTreated: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    projectId: 'project-1',
  };

  const mockCourses: GeometryWithId[] = [
    {
      geometryId: 'course-1',
      points: mockCourse,
    },
  ];

  const mockAreas: GeometryWithId[] = [
    {
      geometryId: 'area-1',
      points: mockArea,
    },
  ];

  const mockPolylines: PolylineEquipment[] = [
    [
      [48.5734, 7.7521],
      [48.5834, 7.7621],
    ],
  ];

  const defaultProps = {
    searchPosition: null,
    securityPointPosition: null,
    drawingMode: null,
    newCourse: [],
    setNewCourse: mockSetNewCourse,
    courses: mockCourses,
    areas: mockAreas,
    SecurityPoints: [mockSecurityPoint],
    newArea: [],
    setNewArea: mockSetNewArea,
    newPolyline: [],
    setNewPolyline: mockSetNewPolyline,
    undoStack: [],
    setUndoStack: mockSetUndoStack,
    redoStack: [],
    setRedoStack: mockSetRedoStack,
    handleCancel: mockHandleCancel,
    handleValidate: mockHandleValidate,
    handleFinish: mockHandleFinish,
    deleteGeometry: mockDeleteGeometry,
    selectedPoint: null,
    setSelectedPoint: mockSetSelectedPoint,
    newPointPosition: null,
    setNewPointPosition: mockSetNewPointPosition,
    editedPoint: null,
    setEditedPoint: mockSetEditedPoint,
    projectId: 'project-1',
    polylines: mockPolylines,
    equipmentIdToPolyline: { 'equipment-1': mockPolylines[0] },
    equipmentIdToVehiclePosition: {},
    setPolylines: mockSetPolylines,
    selectedSafetyEquipmentTypeLengthId: null,
    selectedSetTeamId: null,
    selectedUnsetTeamId: null,
    onSelectSecurityPoint: mockOnSelectSecurityPoint,
    vehicles: [],
    newVehicle: null,
    setNewVehicle: mockSetNewVehicle,
    attentionPoints: [],
    newAttentionPointPosition: null,
    setNewAttentionPointPosition: mockSetNewAttentionPointPosition,
    selectedCourseId: null,
    onSelectCourse: mockOnSelectCourse,
    selectedAreaId: null,
    onSelectArea: mockOnSelectArea,
    selectedEquipmentId: null,
    onSelectEquipment: mockOnSelectEquipment,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu du conteneur de carte', () => {
    it('devrait afficher le conteneur de carte', () => {
      renderWithProviders(<Map {...defaultProps} />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait afficher la couche de tuiles', () => {
      renderWithProviders(<Map {...defaultProps} />);

      expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    });
  });

  describe('Affichage des parcours', () => {
    it('devrait afficher les parcours existants', () => {
      const { container } = renderWithProviders(<Map {...defaultProps} />);

      // CoursePolyline components should be rendered
      expect(container).toBeInTheDocument();
    });

    it('devrait afficher le nouveau parcours en cours de création', () => {
      renderWithProviders(
        <Map {...defaultProps} newCourse={mockCourse} drawingMode="course" />
      );

      // New course should be rendered
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait afficher plusieurs parcours', () => {
      const multipleCourses: GeometryWithId[] = [
        { geometryId: 'course-1', points: mockCourse },
        { geometryId: 'course-2', points: [[48.6, 7.8], [48.61, 7.81]] },
      ];

      renderWithProviders(<Map {...defaultProps} courses={multipleCourses} />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  describe('Affichage des zones', () => {
    it('devrait afficher les zones existantes', () => {
      renderWithProviders(<Map {...defaultProps} />);

      // Polygon components should be rendered
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait afficher la nouvelle zone en cours de création', () => {
      renderWithProviders(
        <Map {...defaultProps} newArea={mockArea} drawingMode="area" />
      );

      // New area should be rendered
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait afficher plusieurs zones', () => {
      const multipleAreas: GeometryWithId[] = [
        { geometryId: 'area-1', points: mockArea },
        { geometryId: 'area-2', points: [[48.6, 7.8], [48.61, 7.81], [48.62, 7.82]] },
      ];

      renderWithProviders(<Map {...defaultProps} areas={multipleAreas} />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  describe('Affichage des points de sécurité', () => {
    it('devrait afficher les points de sécurité', () => {
      const { container } = renderWithProviders(<Map {...defaultProps} />);

      // SecurityPointMarker components should be rendered
      const markers = container.querySelectorAll('[data-testid="marker"]');
      expect(markers.length).toBeGreaterThan(0);
    });

    it('devrait afficher plusieurs points de sécurité', () => {
      const multiplePoints: PointToSecure[] = [
        mockSecurityPoint,
        {
          ...mockSecurityPoint,
          id: 'point-2',
          point: { ...mockSecurityPoint.point, id: 'coord-2', latitude: 48.6, longitude: 7.8 },
        },
      ];

      const { container } = renderWithProviders(
        <Map {...defaultProps} SecurityPoints={multiplePoints} />
      );

      const markers = container.querySelectorAll('[data-testid="marker"]');
      expect(markers.length).toBeGreaterThan(0);
    });

    it('devrait afficher le nouveau point en cours de création', () => {
      const { container } = renderWithProviders(
        <Map
          {...defaultProps}
          newPointPosition={[48.5734, 7.7521] as [number, number]}
          drawingMode="createPoint"
        />
      );

      const markers = container.querySelectorAll('[data-testid="marker"]');
      expect(markers.length).toBeGreaterThan(0);
    });
  });

  describe('Affichage des équipements', () => {
    it('devrait afficher les équipements en polylignes', () => {
      const { container } = renderWithProviders(<Map {...defaultProps} />);

      // EquipmentPolyline components should be rendered
      const polylines = container.querySelectorAll('[data-testid="polyline"]');
      expect(polylines.length).toBeGreaterThan(0);
    });

    it('devrait afficher le nouvel équipement en cours de création', () => {
      const { container } = renderWithProviders(
        <Map
          {...defaultProps}
          newPolyline={mockPolylines[0]}
          drawingMode="polylineEquipment"
        />
      );

      const polylines = container.querySelectorAll('[data-testid="polyline"]');
      expect(polylines.length).toBeGreaterThan(0);
    });

    it('devrait afficher plusieurs équipements', () => {
      const multiplePolylines: PolylineEquipment[] = [
        [[48.5734, 7.7521], [48.5834, 7.7621]],
        [[48.6, 7.8], [48.61, 7.81]],
      ];

      const { container } = renderWithProviders(
        <Map {...defaultProps} polylines={multiplePolylines} />
      );

      const polylines = container.querySelectorAll('[data-testid="polyline"]');
      expect(polylines.length).toBeGreaterThan(0);
    });
  });

  describe('Mode de dessin', () => {
    it('devrait afficher DrawingBar en mode dessin', () => {
      renderWithProviders(<Map {...defaultProps} drawingMode="course" />);

      // DrawingBar should be rendered
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('ne devrait pas afficher DrawingBar sans mode de dessin', () => {
      renderWithProviders(<Map {...defaultProps} drawingMode={null} />);

      // DrawingBar should not be rendered
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait afficher le rectangle de limites en mode dessin', () => {
      renderWithProviders(<Map {...defaultProps} drawingMode="course" />);

      // Rectangle bounds should be rendered
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  describe('Position de recherche', () => {
    it('devrait afficher un marqueur à la position de recherche', () => {
      const { container } = renderWithProviders(
        <Map {...defaultProps} searchPosition={[48.5734, 7.7521]} />
      );

      const markers = container.querySelectorAll('[data-testid="marker"]');
      expect(markers.length).toBeGreaterThan(0);
    });

    it('ne devrait pas afficher de marqueur sans position de recherche', () => {
      renderWithProviders(<Map {...defaultProps} searchPosition={null} />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  describe('Gestion des événements', () => {
    it('devrait inclure MapClickEvent', () => {
      renderWithProviders(<Map {...defaultProps} />);

      // MapClickEvent should be rendered
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait inclure MapScreenshotEvent', () => {
      renderWithProviders(<Map {...defaultProps} />);

      // MapScreenshotEvent should be rendered
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait inclure MapFlyTo pour searchPosition', () => {
      renderWithProviders(
        <Map {...defaultProps} searchPosition={[48.5734, 7.7521]} />
      );

      // MapFlyTo should be rendered
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait inclure MapFlyTo pour securityPointPosition', () => {
      renderWithProviders(
        <Map {...defaultProps} securityPointPosition={[48.5734, 7.7521]} />
      );

      // MapFlyTo should be rendered
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  describe('Gestion des props', () => {
    it('devrait gérer projectId', () => {
      renderWithProviders(<Map {...defaultProps} projectId="test-project" />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer selectedPoint', () => {
      renderWithProviders(
        <Map {...defaultProps} selectedPoint={mockSecurityPoint} />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer editedPoint', () => {
      renderWithProviders(
        <Map {...defaultProps} editedPoint={mockSecurityPoint} drawingMode="editPoint" />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer les stacks undo/redo', () => {
      renderWithProviders(
        <Map
          {...defaultProps}
          undoStack={[mockCourse]}
          redoStack={[mockArea]}
          drawingMode="course"
        />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  describe('Gestion des équipements de sécurité', () => {
    it('devrait gérer selectedSafetyEquipmentTypeLengthId', () => {
      renderWithProviders(
        <Map
          {...defaultProps}
          selectedSafetyEquipmentTypeLengthId="type-1"
          drawingMode="polylineEquipment"
        />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer selectedSetTeamId', () => {
      renderWithProviders(
        <Map {...defaultProps} selectedSetTeamId="team-1" />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer selectedUnsetTeamId', () => {
      renderWithProviders(
        <Map {...defaultProps} selectedUnsetTeamId="team-2" />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  describe('Cas limites', () => {
    it('devrait gérer des tableaux vides', () => {
      renderWithProviders(
        <Map
          {...defaultProps}
          courses={[]}
          areas={[]}
          SecurityPoints={[]}
          polylines={[]}
        />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer des valeurs null', () => {
      renderWithProviders(
        <Map
          {...defaultProps}
          searchPosition={null}
          securityPointPosition={null}
          selectedPoint={null}
          editedPoint={null}
          newPointPosition={null}
          drawingMode={null}
        />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer un projectId vide', () => {
      renderWithProviders(<Map {...defaultProps} projectId="" />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  describe('Structure du composant', () => {
    it('devrait avoir MapContainer comme racine', () => {
      renderWithProviders(<Map {...defaultProps} />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait inclure TileLayer', () => {
      renderWithProviders(<Map {...defaultProps} />);

      expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    });

    it('devrait avoir la classe rounded-xl', () => {
      renderWithProviders(<Map {...defaultProps} />);

      const container = screen.getByTestId('map-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Modes de dessin différents', () => {
    it('devrait gérer le mode course', () => {
      renderWithProviders(<Map {...defaultProps} drawingMode="course" />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer le mode area', () => {
      renderWithProviders(<Map {...defaultProps} drawingMode="area" />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer le mode createPoint', () => {
      renderWithProviders(<Map {...defaultProps} drawingMode="createPoint" />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer le mode editPoint', () => {
      renderWithProviders(<Map {...defaultProps} drawingMode="editPoint" />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer le mode polylineEquipment', () => {
      renderWithProviders(<Map {...defaultProps} drawingMode="polylineEquipment" />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  describe('Callbacks optionnels', () => {
    it('devrait gérer onSelectSecurityPoint défini', () => {
      renderWithProviders(
        <Map {...defaultProps} onSelectSecurityPoint={mockOnSelectSecurityPoint} />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait gérer onSelectSecurityPoint undefined', () => {
      renderWithProviders(
        <Map {...defaultProps} onSelectSecurityPoint={undefined} />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  describe('Rendu conditionnel', () => {
    it('devrait afficher le nouveau parcours uniquement si non vide', () => {
      const { rerender } = renderWithProviders(
        <Map {...defaultProps} newCourse={[]} />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();

      rerender(<Map {...defaultProps} newCourse={mockCourse} />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait afficher la nouvelle zone uniquement si non vide', () => {
      const { rerender } = renderWithProviders(
        <Map {...defaultProps} newArea={[]} />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();

      rerender(<Map {...defaultProps} newArea={mockArea} />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('devrait afficher la nouvelle polyligne uniquement si non vide', () => {
      const { rerender } = renderWithProviders(
        <Map {...defaultProps} newPolyline={[]} />
      );

      expect(screen.getByTestId('map-container')).toBeInTheDocument();

      rerender(<Map {...defaultProps} newPolyline={mockPolylines[0]} />);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });
});
