/* eslint-disable import/first */
// Mock the ESM-only cuid2 package during tests to avoid parse errors
jest.mock('@paralleldrive/cuid2');

// Simple in-memory mock database
class MockDatabase {
  private tables: Map<string, Map<string, any>> = new Map();

  run(sql: string) {
    // Handle CREATE TABLE
    if (sql.includes('CREATE TABLE')) {
      const match = sql.match(/CREATE TABLE.*?"(\w+)"/i);
      if (match) {
        const tableName = match[1];
        if (!this.tables.has(tableName)) {
          this.tables.set(tableName, new Map());
        }
      }
      return;
    }

    // Handle DROP TABLE
    if (sql.includes('DROP TABLE')) {
      const match = sql.match(/DROP TABLE.*?"(\w+)"/i);
      if (match) {
        const tableName = match[1];
        this.tables.delete(tableName);
      }
      return;
    }
  }

  prepare(sql: string) {
    return new MockStatement(sql, this.tables);
  }
}

class MockStatement {
  private sql: string;
  private params: any[] = [];
  private tables: Map<string, Map<string, any>>;
  private currentResult: any[] = [];
  private currentIndex = 0;

  constructor(sql: string, tables: Map<string, Map<string, any>>) {
    this.sql = sql;
    this.tables = tables;
  }

  bind(params: any[]) {
    this.params = params;
    return this;
  }

  step(): boolean {
    // Handle INSERT
    if (this.sql.includes('INSERT')) {
      const insertMatch = this.sql.match(/INSERT INTO\s*"(\w+)"\s*\((.*?)\)\s*VALUES/i);
      if (insertMatch) {
        const tableName = insertMatch[1];
        const columns = insertMatch[2].split(',').map(c => c.trim().replace(/"/g, ''));
        
        const table = this.tables.get(tableName);
        if (table && this.params.length > 0) {
          const id = this.params[0];
          const row: any = {};
          columns.forEach((col, idx) => {
            row[col] = this.params[idx];
          });
          table.set(String(id), row);
        }
      }
      return false;
    }

    // Handle SELECT
    if (this.sql.includes('SELECT')) {
      const selectMatch = this.sql.match(/FROM\s*"(\w+)"/i);
      if (selectMatch && this.currentResult.length === 0) {
        const tableName = selectMatch[1];
        const table = this.tables.get(tableName);
        
        if (table) {
          let results = Array.from(table.values());
          
          // Parse WHERE clause
          if (this.sql.includes('WHERE')) {
            results = results.filter((row) => {
              // Extract WHERE conditions
              const whereMatch = this.sql.match(/WHERE\s*(.*?)(?:ORDER BY|;|$)/i);
              if (!whereMatch) return true;
              
              const whereClause = whereMatch[1];
              const conditions = whereClause.split('AND').map(c => c.trim());
              
              let matchesAll = true;
              let paramIndex = 0;
              
              for (const condition of conditions) {
                const eqMatch = condition.match(/"(\w+)"\s*=\s*\?/);
                if (eqMatch) {
                  const colName = eqMatch[1];
                  const paramValue = this.params[paramIndex];
                  paramIndex++;
                  
                  if (row[colName] !== paramValue) {
                    matchesAll = false;
                    break;
                  }
                }
              }
              
              return matchesAll;
            });
          }
          
          this.currentResult = results;
        }
      }

      if (this.currentIndex < this.currentResult.length) {
        this.currentIndex++;
        return true;
      }
      return false;
    }

    // Handle DELETE
    if (this.sql.includes('DELETE')) {
      const deleteMatch = this.sql.match(/DELETE FROM\s*"(\w+)"/i);
      if (deleteMatch) {
        const tableName = deleteMatch[1];
        const table = this.tables.get(tableName);
        
        if (table) {
          if (this.sql.includes('WHERE') && this.params.length > 0) {
            const whereMatch = this.sql.match(/WHERE\s*"(\w+)"\s*=\s*\?/);
            if (whereMatch) {
              const colName = whereMatch[1];
              const colValue = this.params[0];
              
              // Delete all rows matching the WHERE condition
              const keysToDelete: string[] = [];
              table.forEach((row, key) => {
                if (row[colName] === colValue) {
                  keysToDelete.push(key);
                }
              });
              keysToDelete.forEach(key => table.delete(key));
            }
          } else {
            table.clear();
          }
        }
      }
      return false;
    }

    // Handle UPDATE
    if (this.sql.includes('UPDATE')) {
      const updateMatch = this.sql.match(/UPDATE\s*"(\w+)"/i);
      if (updateMatch) {
        const tableName = updateMatch[1];
        const table = this.tables.get(tableName);
        
        if (table && this.params.length > 0) {
          const id = this.params[this.params.length - 1];
          const row = table.get(String(id));
          if (row) {
            // Extract column names from SET clause
            const setMatch = this.sql.match(/SET\s*(.*?)\s*WHERE/i);
            if (setMatch) {
              const setClauses = setMatch[1].split(',');
              setClauses.forEach((clause, idx) => {
                const colMatch = clause.match(/"(\w+)"\s*=/);
                if (colMatch) {
                  row[colMatch[1]] = this.params[idx];
                }
              });
            }
          }
        }
      }
      return false;
    }

    return false;
  }

  getAsObject(): any {
    if (this.currentIndex > 0 && this.currentIndex <= this.currentResult.length) {
      return this.currentResult[this.currentIndex - 1];
    }
    return {};
  }

  free() {
    this.currentIndex = 0;
    this.currentResult = [];
  }
}

const mockDatabase = new MockDatabase();

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: () => ({
    execAsync: async (sql: string) => {
      try {
        mockDatabase.run(sql);
      } catch (e) {
        console.error('SQL exec error:', sql, e);
        throw e;
      }
    },
    runAsync: async (sql: string, ...params: any[]) => {
      try {
        const stmt = mockDatabase.prepare(sql);
        if (params.length > 0) {
          stmt.bind(params);
        }
        stmt.step();
        stmt.free();
      } catch (e) {
        console.error('SQL run error:', sql, params, e);
        throw e;
      }
    },
    getFirstAsync: async (sql: string, ...params: any[]) => {
      try {
        const stmt = mockDatabase.prepare(sql);
        if (params.length > 0) {
          stmt.bind(params);
        }
        const hasRow = stmt.step();
        if (hasRow) {
          const result = stmt.getAsObject();
          stmt.free();
          return result;
        }
        stmt.free();
        return undefined;
      } catch (e) {
        console.error('SQL getFirst error:', sql, params, e);
        throw e;
      }
    },
    getAllAsync: async (sql: string, ...params: any[]) => {
      try {
        const stmt = mockDatabase.prepare(sql);
        if (params.length > 0) {
          stmt.bind(params);
        }
        const results: any[] = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      } catch (e) {
        console.error('SQL getAll error:', sql, params, e);
        throw e;
      }
    },
  }),
}));

import { db, initDatabase } from '../../db/db';

export const testDb = {
  async connect() {
    await initDatabase();
  },

  async clear() {
    try {
      await db.runAsync(`DELETE FROM "InterestPointImage";`);
      await db.runAsync(`DELETE FROM "InterestPoint";`);
      await db.runAsync(`DELETE FROM "Point";`);
      await db.runAsync(`DELETE FROM "Geometry";`);
      await db.runAsync(`DELETE FROM "Project";`);
    } catch (e) {
      console.warn('[testDb] clear failed', e);
    }
  },

  async close() {
    return;
  },
};

export default testDb;
