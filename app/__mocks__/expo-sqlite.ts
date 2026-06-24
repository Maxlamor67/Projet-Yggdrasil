type Row = { [k: string]: any };

class MockDB {
  private tables: Record<string, Row[]> = {
    projects: [],
    geometries: [],
    geometry_points: [],
    interest_points: [],
    interest_point_images: [],
  };
  private lastInsert = 0;

  async execAsync(_sql: string) {
    return Promise.resolve();
  }

  async runAsync(sql: string, ...params: any[]) {
    const s = sql.trim().toUpperCase();
    if (s.startsWith('INSERT')) {
      this.lastInsert++;
      if (s.includes('INTO PROJECTS')) {
        if (params.length === 1) {
          const id = String(this.lastInsert);
          this.tables.projects.push({ id, name: params[0] });
        } else {
          this.tables.projects.push({ id: params[0], name: params[1] });
        }
      } else if (s.includes('INTO GEOMETRIES')) {
        if (params.length === 3) {
          const id = String(this.lastInsert);
          this.tables.geometries.push({ id, project_id: params[0], type: params[1], name: params[2] });
        } else {
          this.tables.geometries.push({ id: params[0], project_id: params[1], type: params[2], name: params[3] });
        }
      } else if (s.includes('INTO GEOMETRY_POINTS')) {
        if (params.length === 4) {
          const id = String(this.lastInsert);
          this.tables.geometry_points.push({ id, geometry_id: params[0], latitude: params[1], longitude: params[2], rank: params[3] });
        } else {
          this.tables.geometry_points.push({ id: params[0], geometry_id: params[1], latitude: params[2], longitude: params[3], rank: params[4] });
        }
      } else if (s.includes('INTO INTEREST_POINTS')) {
        if (params.length >= 7) {
          const id = String(params[0]);
          this.tables.interest_points.push({ id, project_id: params[1], title: params[2], block_type: params[3], comment: params[4], latitude: params[5], longitude: params[6] });
        } else if (params.length === 6) {
          const id = String(this.lastInsert);
          this.tables.interest_points.push({ id, project_id: params[0], title: params[1], block_type: params[2], comment: params[3], latitude: params[4], longitude: params[5] });
        } else {
          this.tables.interest_points.push({ id: String(this.lastInsert), project_id: params[1], title: params[2] });
        }
      } else if (s.includes('INTO INTEREST_POINT_IMAGES')) {
        this.tables.interest_point_images.push({ id: params[0], interest_point_id: params[1], data_b64: params[2] });
      }
      return Promise.resolve({});
    }

    if (s.startsWith('UPDATE')) {
      if (s.includes('UPDATE INTEREST_POINTS')) {
        const id = String(params[params.length - 1]);
        const row = this.tables.interest_points.find((r) => String(r.id) === id);
        if (row) {
          const p = params;
          row.project_id = p[0] ?? row.project_id;
          row.title = p[1] ?? row.title;
          row.block_type = p[2] ?? row.block_type;
          row.comment = p[3] ?? row.comment;
          row.latitude = p[4] ?? row.latitude;
          row.longitude = p[5] ?? row.longitude;
        }
      }
      return Promise.resolve({});
    }

    if (s.startsWith('DELETE')) {
      const m = sql.match(/DELETE FROM\s+(\w+)/i);
      if (m) {
        const t = m[1];
        if (this.tables[t]) this.tables[t] = [];
      }
      return Promise.resolve({});
    }

    return Promise.resolve({});
  }

  async getFirstAsync(sql: string, ...params: any[]) {
    const s = sql.trim().toUpperCase();
    if (s.startsWith('SELECT COUNT(*) AS C FROM GEOMETRY_POINTS')) {
      return { c: this.tables.geometry_points.length };
    }
    if (s.startsWith('SELECT ID FROM PROJECTS LIMIT 1')) {
      const row = this.tables.projects[0];
      return row ? { id: row.id } : undefined;
    }
    if (s.includes('LAST_INSERT_ROWID')) {
      return { id: String(this.lastInsert) };
    }
    if (s.includes('FROM INTEREST_POINTS') && s.includes('WHERE') && params.length > 0) {
      const id = String(params[0]);
      const found = this.tables.interest_points.find((r) => String(r.id) === id);
      return found || undefined;
    }

    return undefined;
  }

  async getAllAsync(sql: string, ...params: any[]) {
    const s = sql.trim().toUpperCase();
    const pragma = s.match(/PRAGMA TABLE_INFO\((\w+)\)/i);
    if (pragma) {
      return [{ cid: 0, name: 'id', type: 'TEXT', notnull: 0, dflt_value: null, pk: 1 }];
    }
    if (s.startsWith('SELECT')) {
      if (s.includes('FROM GEOMETRY_POINTS')) return this.tables.geometry_points;
      if (s.includes('FROM PROJECTS')) return this.tables.projects;
      if (s.includes('FROM GEOMETRIES')) return this.tables.geometries;
      if (s.includes('FROM INTEREST_POINT_IMAGES')) {
        if (s.includes('WHERE') && params.length > 0) {
          const pid = String(params[0]);
          return this.tables.interest_point_images.filter((r) => String(r.interest_point_id) === pid);
        }
        return this.tables.interest_point_images;
      }
      if (s.includes('FROM INTEREST_POINTS')) {
        if (s.includes('WHERE') && params.length > 0) {
          const p0 = String(params[0]);
          if (s.includes('WHERE PROJECT_ID')) {
            return this.tables.interest_points.filter((r) => String(r.project_id) === p0);
          }
          if (s.includes('WHERE ID')) {
            return this.tables.interest_points.filter((r) => String(r.id) === p0);
          }
        }
        return this.tables.interest_points;
      }
    }
    return [];
  }
}

export function openDatabaseSync(_name: string) {
  return new MockDB();
}

export type SQLiteDatabase = MockDB;

export default { openDatabaseSync };
