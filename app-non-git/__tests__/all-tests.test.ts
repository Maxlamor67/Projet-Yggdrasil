import testDb from '../test/helpers/testDb';
import { InterestPointModel } from '../db/models/interest_point.model';
import { GeometryModel } from '../db/models/geometry.model';


beforeAll(async () => {
  await testDb.connect();
});

afterEach(async () => {
  jest.resetAllMocks();
  await testDb.clear();
});

afterAll(async () => {
  await testDb.close();
});

describe('Suite unique de tests (BDD locale)', () => {
  test('create interest point -> persists in DB', async () => {
    const payload = {
      projectId: '1',
      title: 'Test POI',
      securityElementType: 'INFO',
      securityElementCount: 1,
      comment: 'test',
      latitude: 48.8566,
      longitude: 2.3522,
      images: [],
    };

    const created = await InterestPointModel.create(payload as any);

    const fromDb = await InterestPointModel.getById(created.id);
    expect(fromDb).not.toBeNull();
    expect(fromDb!.title).toBe(payload.title);
    expect(fromDb!.latitude).toBeCloseTo(payload.latitude);
    expect(fromDb!.longitude).toBeCloseTo(payload.longitude);
  });

  test('update interest point -> persisted change', async () => {
    const payload = {
      projectId: '1',
      title: 'Old title',
      securityElementType: 'INFO',
      securityElementCount: 1,
      comment: null,
      latitude: 0,
      longitude: 0,
    } as any;

    const created = await InterestPointModel.create(payload);
    const updated = await InterestPointModel.update(created.id, { title: 'New title' });

    expect(updated).not.toBeNull();
    expect(updated!.title).toBe('New title');
  });

  test('delete interest point -> removed from DB', async () => {
    const payload = {
      projectId: '1',
      title: 'To Delete',
      securityElementType: 'INFO',
      securityElementCount: 1,
      comment: null,
      latitude: 0,
      longitude: 0,
    } as any;

    const created = await InterestPointModel.create(payload);
    await InterestPointModel.delete(created.id);
    const after = await InterestPointModel.getById(created.id);
    expect(after).toBeNull();
  });

  test('geometry points CRUD -> add and list points', async () => {
    const geom = {
      id: `geom_test_${Date.now()}`,
      projectId: '1',
      type: 'ROUTE' as any,
      name: 'Test Route',
    };

    await GeometryModel.createGeometry(geom);

    const p1 = { id: `gp1_${Date.now()}`, geometryId: geom.id, latitude: 10, longitude: 20, rank: 0 };
    const p2 = { id: `gp2_${Date.now()}`, geometryId: geom.id, latitude: 11, longitude: 21, rank: 1 };

    await GeometryModel.addPoint(p1 as any);
    await GeometryModel.addPoint(p2 as any);

    const pts = await GeometryModel.getPoints(geom.id);
    expect(pts.length).toBe(2);
    expect(pts[0].latitude).toBeCloseTo(10);
    expect(pts[1].latitude).toBeCloseTo(11);
  });

  test('interest points listing -> add and list points', async () => {
    const payload1 = {
      projectId: '1',
      title: 'List POI 1',
      securityElementType: 'INFO',
      securityElementCount: 1,
      comment: null,
      latitude: 12.34,
      longitude: 56.78,
    } as any;

    const payload2 = {
      projectId: '1',
      title: 'List POI 2',
      securityElementType: 'INFO',
      securityElementCount: 1,
      comment: null,
      latitude: 21.43,
      longitude: 65.87,
    } as any;

    const c1 = await InterestPointModel.create(payload1);
    const c2 = await InterestPointModel.create(payload2);

    const all = await InterestPointModel.list('1');
    // since DB is cleaned between tests, we expect exactly these two
    expect(all.length).toBe(2);

    const found1 = all.find((x) => x.id === c1.id)!;
    const found2 = all.find((x) => x.id === c2.id)!;

    expect(found1.title).toBe(payload1.title);
    expect(found1.latitude).toBeCloseTo(payload1.latitude);
    expect(found1.longitude).toBeCloseTo(payload1.longitude);

    expect(found2.title).toBe(payload2.title);
    expect(found2.latitude).toBeCloseTo(payload2.latitude);
    expect(found2.longitude).toBeCloseTo(payload2.longitude);
  });

  test('geometry CRUD -> create, add point, delete point and delete geometry', async () => {
    const geomId = `geom_crud_${Date.now()}`;
    const geom = {
      id: geomId,
      projectId: '1',
      type: 'ROUTE' as any,
      name: 'CRUD Route',
    };

    await GeometryModel.createGeometry(geom);

    // list geometries for this project/type -> should contain the created geometry
    const listed = await GeometryModel.listGeometries('1', 'ROUTE');
    const found = listed.find((g) => g.id === geomId);
    expect(found).toBeDefined();

    // add a point, verify it's listed
    const pt = { id: `gpt_${Date.now()}`, geometryId: geomId, latitude: 33.33, longitude: 44.44, rank: 0 };
    await GeometryModel.addPoint(pt as any);

    let pts = await GeometryModel.getPoints(geomId);
    expect(pts.length).toBe(1);
    expect(pts[0].latitude).toBeCloseTo(pt.latitude);

    // delete the point
    await GeometryModel.deletePoint(pt.id);
    pts = await GeometryModel.getPoints(geomId);
    expect(pts.length).toBe(0);

    // delete geometry and ensure it's gone
    await GeometryModel.deleteGeometry(geomId);
    const after = await GeometryModel.listGeometries('1', 'ROUTE');
    const still = after.find((g) => g.id === geomId);
    expect(still).toBeUndefined();
  });
});
