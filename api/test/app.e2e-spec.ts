// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';




type Project = {
  id: string;
  name: string;
  startAtDate?: string | null;
  endAtDate?: string | null;
  createdAt: string;
  updatedAt: string;
};

type SafetyEquipmentTypeLength = {
  id: string;
  safetyEquipmentTypeId: string;
  length: number;
  createdAt: string;
};

type SafetyEquipmentType = {
  id: string;
  name: string;
  model: 'VEHICLE' | 'OBSTACLE';
  createdAt: string;
  lengths: SafetyEquipmentTypeLength[];
};

type Team = {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
};

type TeamDetails = Team & { users: User[] };

type Point = {
  id: string;
  type: 'GEOMETRY' | 'SAFETY_EQUIPMENT' | 'POINT_TO_SECURE' | 'ATTENTION_POINT';
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
};

type PointToSecureListItem = {
  id: string;
  projectId: string;
  pointId: string;
  safetyEquipmentTypeId?: string | null;
  comment?: string | null;
  isTreated: boolean;
  createdAt: string;
  updatedAt: string;
  point: Point;
};

type PointToSecureDetails = {
  id: string;
  projectId: string;
  pointId: string;
  safetyEquipmentTypeId?: string | null;
  comment?: string | null;
  isTreated: boolean;
  createdAt: string;
  updatedAt: string;
  safetyEquipmentType?: { id: string; name: string; model: 'VEHICLE' | 'OBSTACLE'; createdAt: string } | null;
  point: Point;
  photos: Array<{ id: string }>;
};

type GeometryPoint = {
  id: string;
  geometryId: string;
  pointId: string;
  rank: number;
  createdAt: string;
  updatedAt: string;
  point: Point;
};

type Route = {
  id: string;
  geometryId: string;
  startAt: string;
  slowerParticipantSpeedEstimate: number;
  fasterParticipantSpeedEstimate: number;
  createdAt: string;
  updatedAt: string;
};

type Geometry = {
  id: string;
  projectId: string;
  name: string;
  type: 'AREA' | 'ROUTE';
  createdAt: string;
  updatedAt: string;
  route?: Route | null;
  geometryPoints: GeometryPoint[];
};

type Action = {
  id: string;
  safetyEquipmentId: string;
  teamId?: string | null;
  type: 'SET' | 'UNSET';
  realizedAt: string;
  createdAt: string;
  updatedAt: string;
};

type SafetyEquipmentPoint = {
  id: string;
  safetyEquipmentId: string;
  pointId: string;
  rank: number;
  createdAt: string;
  updatedAt: string;
  point: Point;
};

type SafetyEquipmentTypeLengthEmbedded = {
  id: string;
  safetyEquipmentTypeId: string;
  length: number;
  createdAt: string;
  safetyEquipmentType: { id: string; name: string; model: 'VEHICLE' | 'OBSTACLE'; createdAt: string };
};

type SafetyEquipmentListItem = {
  id: string;
  projectId: string;
  safetyEquipmentTypeLengthId: string;
  safetyEquipmentTypeLengthCount: number;
  createdAt: string;
  updatedAt: string;
  safetyEquipmentTypeLength: SafetyEquipmentTypeLengthEmbedded;
  safetyEquipmentPoints: SafetyEquipmentPoint[];
  actions: Array<Action & { team?: Team }>;
};

type AttentionPointListItem = {
  id: string;
  projectId: string;
  pointId: string;
  description: string;
  createdAt: string;
  point: Point;
};

type CreateTransferResponse = {
  ip: string;
  port: number;
  projectId?: string;
  transferId: string;
};

type GetTransferResponse = {
  type: 'APP_TO_SOFTWARE' | 'SOFTWARE_TO_APP' | 'SOFTWARE_TO_APP_PLANNING';
  data: any;
};

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // ---------------------------
  // Helpers (toujours )
  // ---------------------------

  const getSeedProject = async (name = 'Test Project'): Promise<Project> => {
    const res = await request(app.getHttpServer()).get('/projects').expect(200);
    const projects = res.body as Project[];
    expect(Array.isArray(projects)).toBe(true);
    const seed = projects.find((p) => p.name === name);
    expect(seed).toBeDefined();
    return seed!;
  };

  const getSeedTeams = async (projectId: string): Promise<Team[]> => {
    const res = await request(app.getHttpServer()).get(`/projects/${projectId}/teams`).expect(200);
    const teams = res.body as Team[];
    expect(Array.isArray(teams)).toBe(true);
    expect(teams.length).toBeGreaterThan(0);
    return teams;
  };

  const getSeedTeamByName = async (projectId: string, name: string): Promise<Team> => {
    const teams = await getSeedTeams(projectId);
    const team = teams.find((t) => t.name === name);
    expect(team).toBeDefined();
    return team!;
  };

  const getSeedPointsToSecure = async (projectId: string): Promise<PointToSecureListItem[]> => {
    const res = await request(app.getHttpServer()).get(`/projects/${projectId}/points-to-secure`).expect(200);
    const pts = res.body as PointToSecureListItem[];
    expect(Array.isArray(pts)).toBe(true);
    expect(pts.length).toBeGreaterThan(0);
    return pts;
  };

  const getSeedPointToSecureByComment = async (projectId: string, contains: string) => {
    const pts = await getSeedPointsToSecure(projectId);
    const p = pts.find((x) => (x.comment ?? '').includes(contains));
    expect(p).toBeDefined();
    return p!;
  };

  const getSeedPointToSecureDetails = async (projectId: string, id: string): Promise<PointToSecureDetails> => {
    const res = await request(app.getHttpServer()).get(`/projects/${projectId}/points-to-secure/${id}`).expect(200);
    return res.body as PointToSecureDetails;
  };

  const getSeedGeometries = async (projectId: string): Promise<Geometry[]> => {
    const res = await request(app.getHttpServer()).get(`/projects/${projectId}/geometries`).expect(200);
    const geoms = res.body as Geometry[];
    expect(Array.isArray(geoms)).toBe(true);
    expect(geoms.length).toBeGreaterThan(0);
    return geoms;
  };

  const getSeedGeometryByName = async (projectId: string, name: string): Promise<Geometry> => {
    const geoms = await getSeedGeometries(projectId);
    const g = geoms.find((x) => x.name === name);
    expect(g).toBeDefined();
    return g!;
  };

  const getSeedSafetyEquipments = async (projectId: string): Promise<SafetyEquipmentListItem[]> => {
    const res = await request(app.getHttpServer()).get(`/projects/${projectId}/safety-equipment`).expect(200);
    const list = res.body as SafetyEquipmentListItem[];
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    return list;
  };

  const getSeedAttentionPoints = async (projectId: string): Promise<AttentionPointListItem[]> => {
    const res = await request(app.getHttpServer()).get(`/projects/${projectId}/attention-points`).expect(200);
    const list = res.body as AttentionPointListItem[];
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    return list;
  };

  const getSafetyEquipmentTypes = async (): Promise<SafetyEquipmentType[]> => {
    const res = await request(app.getHttpServer()).get('/safety-equipment-types').expect(200);
    const types = res.body as SafetyEquipmentType[];
    expect(Array.isArray(types)).toBe(true);
    return types;
  };

  // ---------------------------
  // Base
  // ---------------------------
  it('/ (GET)', () => request(app.getHttpServer()).get('/').expect(200));

  // ---------------------------
  // App
  // ---------------------------
  it('GET /ip -> returns server IP string', async () => {
    const res = await request(app.getHttpServer()).get('/ip').expect(200);
    expect(res.text || res.body).toBeDefined();
  });

  // ---------------------------
  // SafetyEquipmentTypes
  // ---------------------------
  it('GET /safety-equipment-types -> returns array with lengths', async () => {
    const res = await request(app.getHttpServer()).get('/safety-equipment-types').expect(200);
    const types = res.body as SafetyEquipmentType[];
    expect(Array.isArray(types)).toBe(true);
    expect(types.length).toBeGreaterThan(0);
    expect(Array.isArray(types[0].lengths)).toBe(true);
  });

  // ---------------------------
  // Projects ()
  // ---------------------------
  it('GET /projects -> returns list including seeded projects', async () => {
    const res = await request(app.getHttpServer()).get('/projects').expect(200);
    const projects = res.body as Project[];
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.some((p) => p.name === 'Test Project')).toBe(true);
    expect(projects.some((p) => p.name === 'Test Project 2')).toBe(true);
  });

  it('GET /projects/:id -> returns seeded project', async () => {
    const seed = await getSeedProject('Test Project');
    const res = await request(app.getHttpServer()).get(`/projects/${seed.id}`).expect(200);
    expect((res.body as Project).id).toBe(seed.id);
  });

  it('POST /projects -> creates a project', async () => {
    const uniqueName = `E2E Project ${Date.now()} ${Math.random().toString(16).slice(2)}`;
    const res = await request(app.getHttpServer()).post('/projects').send({ name: uniqueName }).expect(201);
    const created = res.body as Project;
    expect(created.name).toBe(uniqueName);
    await request(app.getHttpServer()).get(`/projects/${created.id}`).expect(200);
  });

  it('POST /projects -> rejects too short name', async () => {
    await request(app.getHttpServer()).post('/projects').send({ name: 'abcd' }).expect(400);
  });

  it('PUT /projects/:id -> updates seeded project2 (204)', async () => {
    // on modifie project2 pour éviter d'impacter d'autres tests qui utilisent "Test Project"
    const seed2 = await getSeedProject('Test Project 2');
    const updatedName = `Test Project 2 UPDATED ${Date.now()}`;

    await request(app.getHttpServer()).put(`/projects/${seed2.id}`).send({ name: updatedName }).expect(204);

    const getRes = await request(app.getHttpServer()).get(`/projects/${seed2.id}`).expect(200);
    expect((getRes.body as Project).name).toBe(updatedName);
  });

  it('DELETE /projects/:id -> deletes seeded project2 (204)', async () => {
    const seed3 = await getSeedProject('Test Project 3');
    await request(app.getHttpServer()).delete(`/projects/${seed3.id}`).expect(204);
    await request(app.getHttpServer()).get(`/projects/${seed3.id}`).expect(404);
  });

  // ---------------------------
  // PointsToSecure
  // ---------------------------
  it('GET /projects/:projectId/points-to-secure -> returns list', async () => {
    const project = await getSeedProject('Test Project');
    const list = await getSeedPointsToSecure(project.id);
    expect(list[0].point).toBeDefined();
  });

  it('GET /projects/:projectId/points-to-secure -> filters by bbox', async () => {
    const project = await getSeedProject('Test Project');

    const res = await request(app.getHttpServer())
      .get(`/projects/${project.id}/points-to-secure`)
      .query({ minLat: 48.5838, maxLat: 48.5840, minLng: 7.7454, maxLng: 7.7457 })
      .expect(200);

    const list = res.body as PointToSecureListItem[];
    const found = list.find((x) => (x.comment ?? '').includes('Point à sécuriser (test)'));
    expect(found).toBeDefined();
  });

  it('GET /projects/:projectId/points-to-secure/:id -> returns seeded point details + photos', async () => {
    const project = await getSeedProject('Test Project');
    const pts = await getSeedPointToSecureByComment(project.id, 'Point à sécuriser (test)');
    const details = await getSeedPointToSecureDetails(project.id, pts.id);
    expect(details.id).toBe(pts.id);
    expect(Array.isArray(details.photos)).toBe(true);
    expect(details.photos.length).toBeGreaterThan(0);
  });

  it('GET /projects/:projectId/points-to-secure/:id/photos/:photoId -> returns bytes', async () => {
    const project = await getSeedProject('Test Project');
    const pts = await getSeedPointToSecureByComment(project.id, 'Point à sécuriser (test)');
    const details = await getSeedPointToSecureDetails(project.id, pts.id);
    const photoId = details.photos[0]?.id;
    expect(typeof photoId).toBe('string');

    const res = await request(app.getHttpServer())
      .get(`/projects/${project.id}/points-to-secure/${pts.id}/photos/${photoId}`)
      .expect(200);

    expect(res.body).toBeDefined();
  });

  it('GET /projects/:projectId/points-to-secure/:id/photos/:photoId -> returns 404 for nonexistent photo', async () => {
    const project = await getSeedProject('Test Project');
    const pts = await getSeedPointToSecureByComment(project.id, 'Point à sécuriser (test)');

    await request(app.getHttpServer())
      .get(`/projects/${project.id}/points-to-secure/${pts.id}/photos/nonexistent-photo-id`)
      .expect(404);
  });

  it('POST /projects/:projectId/points-to-secure -> creates new', async () => {
    const project = await getSeedProject('Test Project');
    const res = await request(app.getHttpServer())
      .post(`/projects/${project.id}/points-to-secure`)
      .send({
        point: { latitude: 48.5851, longitude: 7.7471 },
        isTreated: false,
        comment: 'E2E create pts',
      })
      .expect(201);

    expect(typeof res.body?.id).toBe('string');
    expect(res.body?.projectId).toBe(project.id);
  });

  it('POST /projects/:projectId/points-to-secure -> rejects missing isTreated', async () => {
    const project = await getSeedProject('Test Project');
    await request(app.getHttpServer())
      .post(`/projects/${project.id}/points-to-secure`)
      .send({ point: { latitude: 48.5851, longitude: 7.7471 }, comment: 'E2E invalid pts' })
      .expect(400);
  });

  it('PUT /projects/:projectId/points-to-secure/:id -> updates seeded point2 (204)', async () => {
    const project = await getSeedProject('Test Project');
    const pts2 = await getSeedPointToSecureByComment(project.id, 'Point à sécuriser (test 2)');

    await request(app.getHttpServer())
      .put(`/projects/${project.id}/points-to-secure/${pts2.id}`)
      .send({
        point: { latitude: pts2.point.latitude, longitude: pts2.point.longitude },
        isTreated: false,
        comment: 'Point à sécuriser (test 2) UPDATED',
        safetyEquipmentTypeId: pts2.safetyEquipmentTypeId ?? undefined,
      })
      .expect(204);

    const details = await getSeedPointToSecureDetails(project.id, pts2.id);
    expect(details.comment).toBe('Point à sécuriser (test 2) UPDATED');
    expect(details.isTreated).toBe(false);
  });

  it('DELETE /projects/:projectId/points-to-secure/:id -> deletes seeded point2 (204)', async () => {
    const project = await getSeedProject('Test Project');
    const pts2 = await getSeedPointToSecureByComment(project.id, 'Point à sécuriser (test 2)');
    await request(app.getHttpServer()).delete(`/projects/${project.id}/points-to-secure/${pts2.id}`).expect(204);
    await request(app.getHttpServer()).get(`/projects/${project.id}/points-to-secure/${pts2.id}`).expect(404);
  });

  // ---------------------------
  // Geometries
  // ---------------------------
  it('GET /projects/:projectId/geometries -> returns list', async () => {
    const project = await getSeedProject('Test Project');
    const list = await getSeedGeometries(project.id);
    expect(list.length).toBeGreaterThan(0);
  });

  it('GET /projects/:projectId/geometries/:id -> returns details', async () => {
    const project = await getSeedProject('Test Project');
    const g = await getSeedGeometryByName(project.id, 'Zone Test');
    const res = await request(app.getHttpServer()).get(`/projects/${project.id}/geometries/${g.id}`).expect(200);
    const body = res.body as Geometry;
    expect(body.id).toBe(g.id);
    expect(body.geometryPoints.length).toBeGreaterThanOrEqual(2);
  });

  it('POST /projects/:projectId/geometries -> creates AREA', async () => {
    const project = await getSeedProject('Test Project');
    const res = await request(app.getHttpServer())
      .post(`/projects/${project.id}/geometries`)
      .send({
        type: 'AREA',
        name: `E2E Area ${Date.now()}`,
        points: [
          { rank: 0, latitude: 48.582, longitude: 7.744 },
          { rank: 1, latitude: 48.582, longitude: 7.745 },
        ],
      })
      .expect(201);

    expect(typeof res.body?.id).toBe('string');
  });

  it('POST /projects/:projectId/geometries -> creates ROUTE', async () => {
    const project = await getSeedProject('Test Project');
    const res = await request(app.getHttpServer())
      .post(`/projects/${project.id}/geometries`)
      .send({
        type: 'ROUTE',
        name: `E2E Route ${Date.now()}`,
        points: [
          { rank: 0, latitude: 48.581, longitude: 7.743 },
          { rank: 1, latitude: 48.582, longitude: 7.744 },
        ],
        route: {
          startAt: new Date().toISOString(),
          slowerParticipantSpeedEstimate: 4,
          fasterParticipantSpeedEstimate: 6,
        },
      })
      .expect(201);

    expect(typeof res.body?.id).toBe('string');
  });

  it('POST /projects/:projectId/geometries -> rejects points < 2', async () => {
    const project = await getSeedProject('Test Project');
    await request(app.getHttpServer())
      .post(`/projects/${project.id}/geometries`)
      .send({ type: 'AREA', name: 'Bad geom', points: [{ rank: 0, latitude: 48.582, longitude: 7.744 }] })
      .expect(400);
  });

  it('PUT /projects/:projectId/geometries/:id -> updates seeded geometry (204)', async () => {
    const project = await getSeedProject('Test Project');
    const g = await getSeedGeometryByName(project.id, 'Zone Test');

    await request(app.getHttpServer())
      .put(`/projects/${project.id}/geometries/${g.id}`)
      .send({
        name: 'Zone Test UPDATED',
        points: [
          { rank: 0, latitude: 48.58411, longitude: 7.74491 },
          { rank: 1, latitude: 48.58411, longitude: 7.74621 },
        ],
      })
      .expect(204);

    const getRes = await request(app.getHttpServer()).get(`/projects/${project.id}/geometries/${g.id}`).expect(200);
    expect((getRes.body as Geometry).name).toBe('Zone Test UPDATED');
  });

  it('DELETE /projects/:projectId/geometries/:id -> deletes seeded route geometry (204)', async () => {
    const project = await getSeedProject('Test Project');
    const g = await getSeedGeometryByName(project.id, 'Parcours Test');
    await request(app.getHttpServer()).delete(`/projects/${project.id}/geometries/${g.id}`).expect(204);
    await request(app.getHttpServer()).get(`/projects/${project.id}/geometries/${g.id}`).expect(404);
  });

  // ---------------------------
  // Teams + Members
  // ---------------------------
  it('GET /projects/:projectId/teams -> returns list', async () => {
    const project = await getSeedProject('Test Project');
    const teams = await getSeedTeams(project.id);
    expect(teams.length).toBeGreaterThan(0);
  });

  it('GET /projects/:projectId/teams/:id -> returns team with users', async () => {
    const project = await getSeedProject('Test Project');
    const team = await getSeedTeamByName(project.id, 'Team Test');
    const res = await request(app.getHttpServer()).get(`/projects/${project.id}/teams/${team.id}`).expect(200);
    const body = res.body as TeamDetails;
    expect(body.id).toBe(team.id);
    expect(body.users.length).toBeGreaterThan(0);
  });

  it('POST /projects/:projectId/teams -> creates a team', async () => {
    const project = await getSeedProject('Test Project');
    const res = await request(app.getHttpServer())
      .post(`/projects/${project.id}/teams`)
      .send({ name: `Team ${Date.now()}`, members: ['admin-test', 'user-a-test'] })
      .expect(201);

    expect(typeof res.body?.id).toBe('string');
  });

  it('POST /projects/:projectId/teams -> rejects too short name', async () => {
    const project = await getSeedProject('Test Project');
    await request(app.getHttpServer())
      .post(`/projects/${project.id}/teams`)
      .send({ name: 'abc', members: [] })
      .expect(400);
  });

  it('PUT /projects/:projectId/teams/:id -> updates seeded Team Alpha (204)', async () => {
    const project = await getSeedProject('Test Project');
    const t = await getSeedTeamByName(project.id, 'Team Alpha');

    await request(app.getHttpServer())
      .put(`/projects/${project.id}/teams/${t.id}`)
      .send({ name: 'Team Alpha UPDATED', addMembers: ['admin-test'], removeMembers: ['user-b-test'] })
      .expect(204);

    const res = await request(app.getHttpServer()).get(`/projects/${project.id}/teams/${t.id}`).expect(200);
    const body = res.body as TeamDetails;
    expect(body.name).toBe('Team Alpha UPDATED');
    expect(body.users.some((u) => u.id === 'admin-test')).toBe(true);
    expect(body.users.some((u) => u.id === 'user-b-test')).toBe(false);
  });

  it('DELETE /projects/:projectId/teams/:id -> deletes seeded Team Alpha (204)', async () => {
    const project = await getSeedProject('Test Project');
    const t = await getSeedTeamByName(project.id, 'Team Beta');
    await request(app.getHttpServer()).delete(`/projects/${project.id}/teams/${t.id}`).expect(204);
    await request(app.getHttpServer()).get(`/projects/${project.id}/teams/${t.id}`).expect(404);
  });

  it('GET /projects/:projectId/teams/:id/planning -> returns planning array', async () => {
    const project = await getSeedProject('Test Project');
    const t = await getSeedTeamByName(project.id, 'Team Test');
    const res = await request(app.getHttpServer()).get(`/projects/${project.id}/teams/${t.id}/planning`).expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /projects/:projectId/teams/:teamId/members -> adds member', async () => {
    const project = await getSeedProject('Test Project');
    const t = await getSeedTeamByName(project.id, 'Team Test');
    const res = await request(app.getHttpServer())
      .post(`/projects/${project.id}/teams/${t.id}/members`)
      .send({ userId: 'user-b-test' })
      .expect(201);
    expect(typeof res.body?.id).toBe('string');
  });

  it('DELETE /projects/:projectId/teams/:teamId/members/:id -> deletes seeded user-a-test', async () => {
    const project = await getSeedProject('Test Project');
    const t = await getSeedTeamByName(project.id, 'Team Test');

    const teamRes = await request(app.getHttpServer()).get(`/projects/${project.id}/teams/${t.id}`).expect(200);
    const details = teamRes.body as TeamDetails;
    const member = details.users.find((u) => u.id === 'user-a-test');
    expect(member).toBeDefined();

    await request(app.getHttpServer())
      .delete(`/projects/${project.id}/teams/${t.id}/members/${member!.id}`)
      .expect(204);

    const after = await request(app.getHttpServer()).get(`/projects/${project.id}/teams/${t.id}`).expect(200);
    expect((after.body as TeamDetails).users.some((u) => u.id === 'user-a-test')).toBe(false);
  });

  // ---------------------------
  // Transfers
  // ---------------------------
  it('POST /projects/:projectId/transfers -> creates APP_TO_SOFTWARE transfer', async () => {
    const project = await getSeedProject('Test Project');
    const res = await request(app.getHttpServer())
      .post(`/projects/${project.id}/transfers`)
      .send({ type: 'APP_TO_SOFTWARE' })
      .expect(201);

    expect(typeof (res.body as CreateTransferResponse).transferId).toBe('string');
    expect(typeof (res.body as CreateTransferResponse).ip).toBe('string');
    expect(typeof (res.body as CreateTransferResponse).port).toBe('number');
  });

  it('POST /projects/:projectId/transfers -> creates SOFTWARE_TO_APP transfer', async () => {
    const project = await getSeedProject('Test Project');
    const res = await request(app.getHttpServer())
      .post(`/projects/${project.id}/transfers`)
      .send({ type: 'SOFTWARE_TO_APP' })
      .expect(201);

    expect(typeof (res.body as CreateTransferResponse).transferId).toBe('string');
  });

  it('POST /projects/:projectId/transfers -> creates SOFTWARE_TO_APP_PLANNING transfer', async () => {
    const project = await getSeedProject('Test Project');
    const res = await request(app.getHttpServer())
      .post(`/projects/${project.id}/transfers`)
      .send({ type: 'SOFTWARE_TO_APP_PLANNING' })
      .expect(201);

    expect(typeof (res.body as CreateTransferResponse).transferId).toBe('string');
  });

  it('GET /projects/:projectId/transfers/:id -> joins transfer (created just before)', async () => {
    const project = await getSeedProject('Test Project');
    const create = await request(app.getHttpServer())
      .post(`/projects/${project.id}/transfers`)
      .send({ type: 'SOFTWARE_TO_APP' })
      .expect(201);

    const transferId = (create.body as CreateTransferResponse).transferId;

    const res = await request(app.getHttpServer()).get(`/projects/${project.id}/transfers/${transferId}`).expect(200);
    expect((res.body as GetTransferResponse).data).toBeDefined();
  });

  it('POST /projects/:projectId/transfers/:id/export-planning/:teamId -> exports planning', async () => {
    const project = await getSeedProject('Test Project');
    const team = await getSeedTeamByName(project.id, 'Team Test');

    const create = await request(app.getHttpServer())
      .post(`/projects/${project.id}/transfers`)
      .send({ type: 'SOFTWARE_TO_APP_PLANNING' })
      .expect(201);

    const transferId = (create.body as CreateTransferResponse).transferId;

    const res = await request(app.getHttpServer())
      .post(`/projects/${project.id}/transfers/${transferId}/export-planning/${team.id}`)
      .expect(200);

    expect(typeof res.body?.id).toBe('string');
    expect(Array.isArray(res.body?.safetyEquipments)).toBe(true);
  });

  // ---------------------------
  // SafetyEquipment
  // ---------------------------
  it('GET /projects/:projectId/safety-equipment -> returns list', async () => {
    const project = await getSeedProject('Test Project');
    const list = await getSeedSafetyEquipments(project.id);
    expect(list[0].actions.length).toBeGreaterThan(0);
  });

  it('GET /projects/:projectId/safety-equipment -> includes both VEHICLE and OBSTACLE types', async () => {
    const project = await getSeedProject('Test Project');
    const list = await getSeedSafetyEquipments(project.id);
    const models = list.map((se) => se.safetyEquipmentTypeLength?.safetyEquipmentType?.model).filter(Boolean);
    expect(models.some((m) => m === 'VEHICLE')).toBe(true);
    expect(models.some((m) => m === 'OBSTACLE')).toBe(true);
  });

  it('GET /projects/:projectId/safety-equipment/:id -> returns details with actions and points', async () => {
    const project = await getSeedProject('Test Project');
    const list = await getSeedSafetyEquipments(project.id);
    const se = list[0];

    const res = await request(app.getHttpServer())
      .get(`/projects/${project.id}/safety-equipment/${se.id}`)
      .expect(200);

    expect(res.body?.id).toBe(se.id);
    expect(Array.isArray(res.body?.actions)).toBe(true);
    expect(Array.isArray(res.body?.safetyEquipmentPoints)).toBe(true);
    expect(res.body?.actions?.length).toBeGreaterThan(0);
  });

  it('POST /projects/:projectId/safety-equipment -> creates safety equipment', async () => {
    const project = await getSeedProject('Test Project');
    const types = await request(app.getHttpServer()).get('/safety-equipment-types').expect(200);
    const typeLength = types.body[0]?.lengths?.[0];

    const res = await request(app.getHttpServer())
      .post(`/projects/${project.id}/safety-equipment`)
      .send({
        points: [{ rank: 0, latitude: 48.5858, longitude: 7.7476 }],
        safetyEquipmentTypeLengthId: typeLength?.id,
        setAt: new Date().toISOString(),
        unsetAt: new Date(Date.now() + 3600_000).toISOString(),
      })
      .expect(201);

    expect(typeof res.body?.id).toBe('string');
  });

  it('PUT /projects/:projectId/safety-equipment/:id -> updates seeded safety equipment (204)', async () => {
    const project = await getSeedProject('Test Project');
    const list = await getSeedSafetyEquipments(project.id);
    const se = list[0];

    await request(app.getHttpServer())
      .put(`/projects/${project.id}/safety-equipment/${se.id}`)
      .send({
        points: [{ rank: 0, latitude: 48.5865, longitude: 7.7485 }],
        safetyEquipmentTypeLengthId: se.safetyEquipmentTypeLengthId,
        setAt: new Date().toISOString(),
        unsetAt: new Date(Date.now() + 3600_000).toISOString(),
        setTeamId: se.actions?.[0]?.teamId ?? undefined,
        unsetTeamId: se.actions?.[1]?.teamId ?? undefined,
      })
      .expect(204);
  });

  it('DELETE /projects/:projectId/safety-equipment/:id -> deletes safety equipment (204)', async () => {
    const project = await getSeedProject('Test Project');
    const list = await getSeedSafetyEquipments(project.id);
    const types = await request(app.getHttpServer()).get('/safety-equipment-types').expect(200);
    const typeLength = types.body[0]?.lengths?.[0];

    const created = await request(app.getHttpServer())
      .post(`/projects/${project.id}/safety-equipment`)
      .send({
        points: [{ rank: 0, latitude: 48.5859, longitude: 7.7477 }],
        safetyEquipmentTypeLengthId: typeLength?.id,
        setAt: new Date().toISOString(),
        unsetAt: new Date(Date.now() + 3600_000).toISOString(),
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/projects/${project.id}/safety-equipment/${created.body?.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/projects/${project.id}/safety-equipment/${created.body?.id}`)
      .expect(404);
  });

  it('PUT /projects/:projectId/safety-equipment/:seId/actions/:id -> updates action teamId (204)', async () => {
    const project = await getSeedProject('Test Project');
    const list = await getSeedSafetyEquipments(project.id);
    const se = list.find((x) => x.actions?.length > 0)!;
    const actionId = se.actions[0].id;
    const team = await getSeedTeamByName(project.id, 'Team Test');

    await request(app.getHttpServer())
      .put(`/projects/${project.id}/safety-equipment/${se.id}/actions/${actionId}`)
      .send({ teamId: team.id })
      .expect(204);

    const after = await request(app.getHttpServer()).get(`/projects/${project.id}/safety-equipment/${se.id}`).expect(200);
    const updated = (after.body as SafetyEquipmentListItem).actions.find((a) => a.id === actionId);
    expect(updated?.teamId).toBe(team.id);
  });

  // ---------------------------
  // AttentionPoints
  // ---------------------------
  it('GET /projects/:projectId/attention-points -> returns list', async () => {
    const project = await getSeedProject('Test Project');
    const list = await getSeedAttentionPoints(project.id);
    expect(list.length).toBeGreaterThan(0);
  });

  it('POST /projects/:projectId/attention-points -> creates new attention point', async () => {
    const project = await getSeedProject('Test Project');
    const res = await request(app.getHttpServer())
      .post(`/projects/${project.id}/attention-points`)
      .send({
        point: { latitude: 48.5852, longitude: 7.7472 },
        description: 'E2E Attention Point Test',
      })
      .expect(201);

    expect(typeof res.body?.id).toBe('string');
    expect(res.body?.projectId).toBe(project.id);
    expect(res.body?.description).toBe('E2E Attention Point Test');
  });

  it('POST /projects/:projectId/attention-points -> rejects missing description', async () => {
    const project = await getSeedProject('Test Project');
    await request(app.getHttpServer())
      .post(`/projects/${project.id}/attention-points`)
      .send({ point: { latitude: 48.5852, longitude: 7.7472 } })
      .expect(400);
  });

  it('GET /projects/:projectId/attention-points/:id -> returns details', async () => {
    const project = await getSeedProject('Test Project');
    const list = await getSeedAttentionPoints(project.id);
    const ap = list[0];

    const res = await request(app.getHttpServer())
      .get(`/projects/${project.id}/attention-points/${ap.id}`)
      .expect(200);

    expect(res.body?.id).toBe(ap.id);
    expect(res.body?.point).toBeDefined();
  });

  it('DELETE /projects/:projectId/attention-points/:id -> deletes seeded one (204)', async () => {
    const project = await getSeedProject('Test Project');
    const list = await getSeedAttentionPoints(project.id);
    const seeded = list.find((x) => (x.description ?? '').includes('seed-test')) ?? list[0];

    await request(app.getHttpServer()).delete(`/projects/${project.id}/attention-points/${seeded.id}`).expect(204);
    await request(app.getHttpServer()).get(`/projects/${project.id}/attention-points/${seeded.id}`).expect(404);
  });

  // ---------------------------
  // Map
  // ---------------------------
  it('GET /maps/search?q=... -> returns array', async () => {
    const res = await request(app.getHttpServer()).get('/maps/search').query({ q: 'Strasbourg' }).expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /maps/tiles/:z/:x/:y -> returns bytes with image/png', async () => {
    const res = await request(app.getHttpServer()).get('/maps/tiles/12/8544/5656').expect(404);
    expect(res.body).toBeDefined();
  });

  it('GET /maps/tiles/:z/:x/:y -> returns bytes with image/png', async () => {
    const res = await request(app.getHttpServer()).get('/maps/tiles/14/8544/5656').expect(200);
    expect(res.body).toBeDefined();
  });
});
