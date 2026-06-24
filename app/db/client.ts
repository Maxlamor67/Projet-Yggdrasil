import { drizzle } from 'drizzle-orm/expo-sqlite';
import {deleteDatabaseSync, openDatabaseSync} from 'expo-sqlite';
import * as schema from './schema';

//deleteDatabaseSync(process.env.EXPO_PUBLIC_DATABASE_URL!);
export const expoDb = openDatabaseSync(process.env.EXPO_PUBLIC_DATABASE_URL!);

export const db = drizzle(expoDb, { schema });