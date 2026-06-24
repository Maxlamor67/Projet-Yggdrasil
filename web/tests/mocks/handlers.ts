/**
 * MSW (Mock Service Worker) handlers for API mocking
 * These handlers intercept HTTP requests during tests and return mock data
 */

import { http, HttpResponse } from 'msw';

const API_BASE_URL = import.meta.env.VITE_HTTP_API_URL || 'http://localhost:3001';

// Mock data fixtures
export const mockProject = {
  id: '123',
  name: 'Test Project',
  description: 'A test project',
  startDate: '2026-01-01T00:00:00.000Z',
  endDate: '2026-12-31T23:59:59.999Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const mockProjects = [
  mockProject,
  {
    id: '456',
    name: 'Second Project',
    description: 'Another test project',
    startDate: '2026-02-01T00:00:00.000Z',
    endDate: '2026-11-30T23:59:59.999Z',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
];

export const mockPointToSecure = {
  id: 'point-1',
  projectId: '123',
  name: 'Point de sécurité 1',
  latitude: 48.5734,
  longitude: 7.7521,
  treated: false,
  safetyEquipmentTypeId: 'equipment-type-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const mockPointsToSecure = [
  mockPointToSecure,
  {
    id: 'point-2',
    projectId: '123',
    name: 'Point de sécurité 2',
    latitude: 48.5834,
    longitude: 7.7621,
    treated: true,
    safetyEquipmentTypeId: 'equipment-type-2',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];

export const mockSafetyEquipmentType = {
  id: 'equipment-type-1',
  name: 'Barrière',
  description: 'Barrière de sécurité',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const mockSafetyEquipmentTypes = [
  mockSafetyEquipmentType,
  {
    id: 'equipment-type-2',
    name: 'Cône',
    description: 'Cône de signalisation',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'equipment-type-3',
    name: 'Panneau',
    description: 'Panneau de signalisation',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

export const mockGeometry = {
  id: 'geometry-1',
  projectId: '123',
  type: 'LineString',
  coordinates: [
    [7.7521, 48.5734],
    [7.7621, 48.5834],
  ],
  properties: {
    name: 'Parcours Test',
    speedFast: 50,
    speedSlow: 30,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const mockGeometries = [
  mockGeometry,
  {
    id: 'geometry-2',
    projectId: '123',
    type: 'Polygon',
    coordinates: [
      [
        [7.7521, 48.5734],
        [7.7621, 48.5834],
        [7.7721, 48.5734],
        [7.7521, 48.5734],
      ],
    ],
    properties: {
      name: 'Zone Test',
    },
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];

export const mockSafetyEquipment = {
  id: 'equipment-1',
  projectId: '123',
  geometryId: 'geometry-1',
  safetyEquipmentTypeId: 'equipment-type-1',
  length: 10,
  startDate: '2026-01-01T08:00:00.000Z',
  endDate: '2026-01-01T18:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const mockSafetyEquipments = [
  mockSafetyEquipment,
  {
    id: 'equipment-2',
    projectId: '123',
    geometryId: 'geometry-1',
    safetyEquipmentTypeId: 'equipment-type-2',
    length: 5,
    startDate: '2026-01-01T08:00:00.000Z',
    endDate: '2026-01-01T18:00:00.000Z',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];

export const mockTeam = {
  id: 'team-1',
  name: 'Équipe Alpha',
  description: 'Équipe de test',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const mockTeams = [
  mockTeam,
  {
    id: 'team-2',
    name: 'Équipe Beta',
    description: 'Deuxième équipe de test',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const mockPlanningAction = {
  id: 'action-1',
  type: 'SET',
  realizedAt: '2026-01-15T09:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const mockPlanningData = [
  {
    id: 'planning-item-1',
    safetyEquipmentTypeLength: {
      id: 'length-1',
      length: 10,
      safetyEquipmentType: {
        id: 'type-1',
        name: 'Barrière',
        model: 'OBSTACLE',
      },
    },
    safetyEquipmentTypeLengthCount: 2,
    safetyEquipmentPoints: [
      {
        rank: 0,
        point: {
          id: 'point-1',
          latitude: 48.5734,
          longitude: 7.7521,
        },
      },
      {
        rank: 1,
        point: {
          id: 'point-2',
          latitude: 48.5834,
          longitude: 7.7621,
        },
      },
    ],
    actions: [
      {
        id: 'action-1',
        type: 'SET',
        realizedAt: '2026-01-15T09:00:00.000Z',
      },
      {
        id: 'action-2',
        type: 'UNSET',
        realizedAt: '2026-01-15T17:00:00.000Z',
      },
    ],
  },
];

// MSW Handlers
export const handlers = [
  // Projects
  http.get(`${API_BASE_URL}/api/projects`, () => {
    return HttpResponse.json(mockProjects);
  }),

  http.get(`${API_BASE_URL}/api/projects/:id`, ({ params }) => {
    const project = mockProjects.find(p => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return HttpResponse.json(project);
  }),

  http.post(`${API_BASE_URL}/api/projects`, async ({ request }) => {
    const body = await request.json() as Record<string, any>;
    const newProject = {
      id: `project-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newProject, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/api/projects/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const project = mockProjects.find(p => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    const updatedProject = {
      ...project,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(updatedProject);
  }),

  http.delete(`${API_BASE_URL}/api/projects/:id`, ({ params }) => {
    const project = mockProjects.find(p => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return HttpResponse.json({ message: 'Project deleted successfully' });
  }),

  // Points to Secure
  http.get(`${API_BASE_URL}/api/projects/:projectId/points-to-secure`, ({ params }) => {
    const points = mockPointsToSecure.filter(p => p.projectId === params.projectId);
    return HttpResponse.json(points);
  }),

  http.post(`${API_BASE_URL}/api/projects/:projectId/points-to-secure`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const newPoint = {
      id: `point-${Date.now()}`,
      projectId: params.projectId as string,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newPoint, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/api/projects/:projectId/points-to-secure/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const point = mockPointsToSecure.find(p => p.id === params.id && p.projectId === params.projectId);
    if (!point) {
      return HttpResponse.json({ message: 'Point not found' }, { status: 404 });
    }
    const updatedPoint = {
      ...point,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(updatedPoint);
  }),

  http.delete(`${API_BASE_URL}/api/projects/:projectId/points-to-secure/:id`, ({ params }) => {
    const point = mockPointsToSecure.find(p => p.id === params.id && p.projectId === params.projectId);
    if (!point) {
      return HttpResponse.json({ message: 'Point not found' }, { status: 404 });
    }
    return HttpResponse.json({ message: 'Point deleted successfully' });
  }),

  // Safety Equipment Types
  http.get(`${API_BASE_URL}/api/safety-equipment-types`, () => {
    return HttpResponse.json(mockSafetyEquipmentTypes);
  }),

  http.get(`${API_BASE_URL}/safety-equipment-types`, () => {
    return HttpResponse.json(mockSafetyEquipmentTypes);
  }),

  // Geometries (Courses/Areas)
  http.get(`${API_BASE_URL}/api/projects/:projectId/geometries`, ({ params }) => {
    const geometries = mockGeometries.filter(g => g.projectId === params.projectId);
    return HttpResponse.json(geometries);
  }),

  http.post(`${API_BASE_URL}/api/projects/:projectId/geometries`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const newGeometry = {
      id: `geometry-${Date.now()}`,
      projectId: params.projectId as string,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newGeometry, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/api/projects/:projectId/geometries/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const geometry = mockGeometries.find(g => g.id === params.id && g.projectId === params.projectId);
    if (!geometry) {
      return HttpResponse.json({ message: 'Geometry not found' }, { status: 404 });
    }
    const updatedGeometry = {
      ...geometry,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(updatedGeometry);
  }),

  http.delete(`${API_BASE_URL}/api/projects/:projectId/geometries/:id`, ({ params }) => {
    const geometry = mockGeometries.find(g => g.id === params.id && g.projectId === params.projectId);
    if (!geometry) {
      return HttpResponse.json({ message: 'Geometry not found' }, { status: 404 });
    }
    return HttpResponse.json({ message: 'Geometry deleted successfully' });
  }),

  // Safety Equipments
  http.get(`${API_BASE_URL}/api/projects/:projectId/safety-equipments`, ({ params }) => {
    const equipments = mockSafetyEquipments.filter(e => e.projectId === params.projectId);
    return HttpResponse.json(equipments);
  }),

  http.post(`${API_BASE_URL}/api/projects/:projectId/safety-equipments`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const newEquipment = {
      id: `equipment-${Date.now()}`,
      projectId: params.projectId as string,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newEquipment, { status: 201 });
  }),

  // Teams
  http.get(`${API_BASE_URL}/api/teams`, () => {
    return HttpResponse.json(mockTeams);
  }),

  http.post(`${API_BASE_URL}/api/teams`, async ({ request }) => {
    const body = await request.json() as Record<string, any>;
    const newTeam = {
      id: `team-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newTeam, { status: 201 });
  }),

  // Users
  http.get(`${API_BASE_URL}/api/users`, () => {
    return HttpResponse.json([mockUser]);
  }),

  http.get(`${API_BASE_URL}/api/users/me`, () => {
    return HttpResponse.json(mockUser);
  }),

  // Error simulation handlers (can be used in specific tests)
  http.get(`${API_BASE_URL}/api/error/500`, () => {
    return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }),

  http.get(`${API_BASE_URL}/api/error/404`, () => {
    return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
  }),

  http.get(`${API_BASE_URL}/api/error/timeout`, () => {
    return new Promise(() => {
      // Never resolves - simulates timeout
    });
  }),

  // ==================== V2 API ENDPOINTS ====================

  // Projects V2
  http.get(`${API_BASE_URL}/api/v2/projects`, () => {
    return HttpResponse.json(mockProjects);
  }),

  http.get(`${API_BASE_URL}/api/v2/projects/:id`, ({ params }) => {
    const project = mockProjects.find(p => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return HttpResponse.json(project);
  }),

  http.post(`${API_BASE_URL}/api/v2/projects`, async ({ request }) => {
    const body = await request.json() as Record<string, any>;
    const newProject = {
      id: `project-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newProject, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/api/v2/projects/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const project = mockProjects.find(p => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    const updatedProject = {
      ...project,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(updatedProject);
  }),

  http.delete(`${API_BASE_URL}/api/v2/projects/:id`, ({ params }) => {
    const project = mockProjects.find(p => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return HttpResponse.json({ message: 'Project deleted successfully' });
  }),

  // Points to Secure V2
  http.get(`${API_BASE_URL}/v2/projects/:projectId/points-to-secure`, ({ params }) => {
    const points = mockPointsToSecure.filter(p => p.projectId === params.projectId);
    return HttpResponse.json(points);
  }),

  http.get(`${API_BASE_URL}/v2/projects/:projectId/points-to-secure/:id`, ({ params }) => {
    const point = mockPointsToSecure.find(p => p.id === params.id && p.projectId === params.projectId);
    if (!point) {
      return HttpResponse.json({ message: 'Point not found' }, { status: 404 });
    }
    return HttpResponse.json(point);
  }),

  http.get(`${API_BASE_URL}/api/v2/projects/:projectId/points-to-secure`, ({ params }) => {
    const points = mockPointsToSecure.filter(p => p.projectId === params.projectId);
    return HttpResponse.json(points);
  }),

  http.post(`${API_BASE_URL}/api/v2/projects/:projectId/points-to-secure`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const newPoint = {
      id: `point-${Date.now()}`,
      projectId: params.projectId as string,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newPoint, { status: 201 });
  }),

  // Geometries V2
  http.get(`${API_BASE_URL}/v2/projects/:projectId/geometries`, ({ params }) => {
    const geometries = mockGeometries.filter(g => g.projectId === params.projectId);
    return HttpResponse.json(geometries);
  }),

  http.get(`${API_BASE_URL}/api/v2/projects/:projectId/geometries`, ({ params }) => {
    const geometries = mockGeometries.filter(g => g.projectId === params.projectId);
    return HttpResponse.json(geometries);
  }),

  http.post(`${API_BASE_URL}/api/v2/projects/:projectId/geometries`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const newGeometry = {
      id: `geometry-${Date.now()}`,
      projectId: params.projectId as string,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newGeometry, { status: 201 });
  }),

  // Safety Equipments V2
  http.get(`${API_BASE_URL}/api/v2/projects/:projectId/safety-equipments`, ({ params }) => {
    const equipments = mockSafetyEquipments.filter(e => e.projectId === params.projectId);
    return HttpResponse.json(equipments);
  }),

  http.post(`${API_BASE_URL}/api/v2/projects/:projectId/safety-equipments`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const newEquipment = {
      id: `equipment-${Date.now()}`,
      projectId: params.projectId as string,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newEquipment, { status: 201 });
  }),

  // Safety Equipment Types V2
  http.get(`${API_BASE_URL}/api/v2/safety-equipment-types`, () => {
    return HttpResponse.json(mockSafetyEquipmentTypes);
  }),

  // Teams V2
  http.get(`${API_BASE_URL}/v2/projects/:projectId/teams`, () => {
    return HttpResponse.json(mockTeams);
  }),

  http.get(`${API_BASE_URL}/api/v2/projects/:projectId/teams`, () => {
    return HttpResponse.json(mockTeams);
  }),

  http.post(`${API_BASE_URL}/api/v2/projects/:projectId/teams`, async ({ request }) => {
    const body = await request.json() as Record<string, any>;
    const newTeam = {
      id: `team-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newTeam, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/api/v2/projects/:projectId/teams/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const team = mockTeams.find(t => t.id === params.id);
    if (!team) {
      return HttpResponse.json({ message: 'Team not found' }, { status: 404 });
    }
    const updatedTeam = {
      ...team,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(updatedTeam);
  }),

  http.delete(`${API_BASE_URL}/api/v2/projects/:projectId/teams/:id`, ({ params }) => {
    const team = mockTeams.find(t => t.id === params.id);
    if (!team) {
      return HttpResponse.json({ message: 'Team not found' }, { status: 404 });
    }
    return HttpResponse.json({ message: 'Team deleted successfully' });
  }),

  // Team Planning V2
  http.get(`${API_BASE_URL}/api/v2/projects/:projectId/teams/:teamId/planning`, () => {
    return HttpResponse.json(mockPlanningData);
  }),
];
