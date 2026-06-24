/**
 * Mock data fixtures for tests
 * Centralized location for test data used across multiple test files
 */

export const mockProjectData = {
  id: '123',
  name: 'Projet Test',
  description: 'Description du projet test',
  startDate: '2026-01-01T00:00:00.000Z',
  endDate: '2026-12-31T23:59:59.999Z',
};

export const mockPointData = {
  id: 'point-1',
  projectId: '123',
  name: 'Point de sécurité',
  latitude: 48.5734,
  longitude: 7.7521,
  treated: false,
  safetyEquipmentTypeId: 'type-1',
};

export const mockGeometryData = {
  id: 'geometry-1',
  projectId: '123',
  type: 'LineString' as const,
  coordinates: [
    [7.7521, 48.5734],
    [7.7621, 48.5834],
  ],
  properties: {
    name: 'Parcours Test',
    speedFast: 50,
    speedSlow: 30,
  },
};

export const mockEquipmentTypeData = {
  id: 'type-1',
  name: 'Barrière',
  description: 'Barrière de sécurité',
};

export const mockTeamData = {
  id: 'team-1',
  name: 'Équipe Alpha',
  description: 'Équipe de test',
};

export const mockUserData = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin',
};

export const mockSafetyEquipmentData = {
  id: 'equipment-1',
  projectId: '123',
  geometryId: 'geometry-1',
  safetyEquipmentTypeId: 'type-1',
  length: 10,
  startDate: '2026-01-01T08:00:00.000Z',
  endDate: '2026-01-01T18:00:00.000Z',
};

// Strasbourg coordinates (used in address search)
export const strasbourgCoordinates = {
  lat: 48.5734,
  lng: 7.7521,
};

// Mock geosearch results
export const mockGeoSearchResults = [
  {
    x: 7.7521,
    y: 48.5734,
    label: 'Place Kléber, Strasbourg',
    bounds: [
      [48.573, 7.751],
      [48.574, 7.753],
    ],
    raw: {
      place_id: 1234,
      osm_type: 'node',
      osm_id: 5678,
      display_name: 'Place Kléber, Strasbourg, Bas-Rhin, Grand Est, France',
      address: {
        city: 'Strasbourg',
        postcode: '67000',
      },
    },
  },
  {
    x: 7.7621,
    y: 48.5834,
    label: 'Cathédrale Notre-Dame, Strasbourg',
    bounds: [
      [48.583, 7.761],
      [48.584, 7.763],
    ],
    raw: {
      place_id: 5678,
      osm_type: 'way',
      osm_id: 9012,
      display_name: 'Cathédrale Notre-Dame, Strasbourg, Bas-Rhin, Grand Est, France',
      address: {
        city: 'Strasbourg',
        postcode: '67000',
      },
    },
  },
];
