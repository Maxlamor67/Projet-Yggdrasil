import {sqliteTable} from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import {relations, sql} from "drizzle-orm";

const projectType = t.customType<{
    data: string;
    driverData: string;
}>({
    dataType() {
        return "text";
    },
    toDriver(value: string): string {
        if (!["SOFTWARE_TO_APP", "SOFTWARE_TO_APP_PLANNING"].includes(value)) throw Error(`Valeur invalide pour l'énumeration: ${value}`);
        return value;
    },
});

const safetyEquipmentTypeModel = t.customType<{
    data: string;
    driverData: string;
}>({
    dataType() {
        return "text";
    },
    toDriver(value: string): string {
        if (!["OBSTACLE", "VEHICLE"].includes(value)) throw Error(`Valeur invalide pour l'énumeration: ${value}`);
        return value;
    },
});

const geometryType = t.customType<{
    data: string;
    driverData: string;
}>({
    dataType() {
        return "text";
    },
    toDriver(value: string): string {
        if (!["AREA", "ROUTE"].includes(value)) throw Error(`Valeur invalide pour l'énumeration: ${value}`);
        return value;
    },
});

const actionType = t.customType<{
    data: string;
    driverData: string;
}>({
    dataType() {
        return "text";
    },
    toDriver(value: string): string {
        if (!["SET", "UNSET"].includes(value)) throw Error(`Valeur invalide pour l'énumeration: ${value}`);
        return value;
    },
});

const uint8ArrayBlob = t.customType<{ data: Uint8Array; driverData: Uint8Array }>({
    dataType() {
        return 'blob';
    },
    toDriver(value: Uint8Array): Uint8Array {
        return value;
    },
    fromDriver(value: unknown): Uint8Array {
        return value as Uint8Array;
    },
});

export const projects = sqliteTable("Project", {
    id: t.text().primaryKey(),
    name: t.text().notNull(),
    type: projectType().$type<"SOFTWARE_TO_APP" | "SOFTWARE_TO_APP_PLANNING">().notNull(),
    createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const projectsRelations = relations(projects, ({ many }) => ({
    geometries: many(geometries),
    pointsToSecure: many(pointsToSecure),
    teams: many(teams),
    schedules: many(schedules),
}));

export const points = sqliteTable("Point", {
    id: t.integer().primaryKey({ autoIncrement: true }),
    latitude: t.real().notNull(),
    longitude: t.real().notNull(),
    createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`).$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const pointsRelations = relations(points, ({ one }) => ({
    geometryPoint: one(geometryPoints),
    pointToSecure: one(pointsToSecure),
    schedule: one(schedules),
}));

export const geometries = sqliteTable("Geometry", {
    id: t.integer().primaryKey({ autoIncrement: true }),
    projectId: t.text().notNull().references(() => projects.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    name: t.text().notNull(),
    type: geometryType().$type<"AREA" | "ROUTE">().notNull(),
    createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const geometriesRelations = relations(geometries, ({ many, one }) => ({
    points: many(geometryPoints),
    project: one(projects, {
        fields: [geometries.projectId],
        references: [projects.id],
    }),
}));

export const geometryPoints = sqliteTable("GeometryPoint", {
    id: t.integer().primaryKey({ autoIncrement: true }),
    geometryId: t.integer().notNull().references(() => geometries.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    pointId: t.integer().notNull().unique().references(() => points.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    rank: t.integer().notNull(),
    createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const geometryPointsRelations = relations(geometryPoints, ({ one }) => ({
    point: one(points, {
        fields: [geometryPoints.pointId],
        references: [points.id],
    }),
    geometry: one(geometries, {
        fields: [geometryPoints.geometryId],
        references: [geometries.id],
    }),
}));

export const safetyEquipmentTypes = sqliteTable("SafetyEquipmentType", {
    id: t.text().primaryKey(),
    name: t.text().notNull(),
    model: safetyEquipmentTypeModel().$type<"OBSTACLE" | "VEHICLE">().notNull(),
    createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const safetyEquipmentTypesRelations = relations(safetyEquipmentTypes, ({ many }) => ({
    lengths: many(safetyEquipmentTypeLengths),
    pointsToSecure: many(pointsToSecure),
}));

export const safetyEquipmentTypeLengths = sqliteTable("SafetyEquipmentTypeLength", {
        id: t.text().primaryKey(),
        safetyEquipmentTypeId: t.text().notNull().references(() => safetyEquipmentTypes.id, {
            onUpdate: 'restrict',
            onDelete: 'cascade',
        }),
        length: t.real().notNull(),
        createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    },
    (table) => [
        t.unique().on(table.safetyEquipmentTypeId, table.length),
    ]
);

export const safetyEquipmentTypeLengthsRelations = relations(safetyEquipmentTypeLengths, ({ one, many }) => ({
    safetyEquipmentType: one(safetyEquipmentTypes, {
        fields: [safetyEquipmentTypeLengths.safetyEquipmentTypeId],
        references: [safetyEquipmentTypes.id],
    }),
    schedules: many(schedules),
}));

export const pointsToSecure = sqliteTable("PointToSecure", {
    id: t.integer().primaryKey({ autoIncrement: true }),
    projectId: t.text().notNull().references(() => projects.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    pointId: t.integer().notNull().unique().references(() => points.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    safetyEquipmentTypeId: t.text().references(() => safetyEquipmentTypes.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    comment: t.text(),
    createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`).$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const pointsToSecureRelations = relations(pointsToSecure, ({ one, many }) => ({
    project: one(projects, {
        fields: [pointsToSecure.projectId],
        references: [projects.id],
    }),
    point: one(points, {
        fields: [pointsToSecure.pointId],
        references: [points.id],
    }),
    safetyEquipmentType: one(safetyEquipmentTypes, {
        fields: [pointsToSecure.safetyEquipmentTypeId],
        references: [safetyEquipmentTypes.id],
    }),
    photos: many(pointToSecurePhotos),
}));

export const pointToSecurePhotos = sqliteTable("PointToSecurePhoto", {
    id: t.integer().primaryKey({ autoIncrement: true }),
    pointToSecureId: t.integer().notNull().references(() => pointsToSecure.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    mimeType: t.text().notNull(),
    data: uint8ArrayBlob().notNull(),
    createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const pointToSecurePhotosRelations = relations(pointToSecurePhotos, ({ one }) => ({
    pointToSecure: one(pointsToSecure, {
        fields: [pointToSecurePhotos.pointToSecureId],
        references: [pointsToSecure.id],
    }),
}));

export const teams = sqliteTable("Team", {
    id: t.text().primaryKey(),
    projectId: t.text().notNull().references(() => projects.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    name: t.text().notNull(),
    createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const teamsRelations = relations(teams, ({ one }) => ({
    project: one(projects, {
        fields: [teams.projectId],
        references: [projects.id],
    }),
}));

export const schedules = sqliteTable("Schedule", {
    id: t.text().primaryKey(),
    projectId: t.text().notNull().references(() => projects.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    safetyEquipmentTypeLengthId: t.text().notNull().references(() => safetyEquipmentTypeLengths.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    schedulePointPointerId: t.integer().notNull().references(() => schedulePointPointers.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    quantity: t.integer().notNull(),
    actionType: actionType().$type<"SET" | "UNSET">().notNull(),
    actionAt: t.text().notNull(),
    isTreated: t.integer().notNull().default(0),
    createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const schedulesRelations = relations(schedules, ({ one }) => ({
    project: one(projects, {
        fields: [schedules.projectId],
        references: [projects.id],
    }),
    safetyEquipmentTypeLength: one(safetyEquipmentTypeLengths, {
        fields: [schedules.safetyEquipmentTypeLengthId],
        references: [safetyEquipmentTypeLengths.id],
    }),
    pointer: one(schedulePointPointers, {
        fields: [schedules.schedulePointPointerId],
        references: [schedulePointPointers.id],
    }),
}));

export const schedulePointPointers = sqliteTable("SchedulePointPointer", {
    id: t.integer().primaryKey({ autoIncrement: true }),
    createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const schedulePointPointersRelations = relations(schedulePointPointers, ({ many }) => ({
    schedules: many(schedules),
    points: many(schedulePoints),
}));

export const schedulePoints = sqliteTable("SchedulePoint", {
    id: t.integer().primaryKey({ autoIncrement: true }),
    schedulePointPointerId: t.integer().notNull().references(() => schedulePointPointers.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    pointId: t.integer().notNull().unique().references(() => points.id, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
    }),
    rank: t.integer().notNull(),
    createdAt: t.text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const schedulePointsRelations = relations(schedulePoints, ({ one }) => ({
    point: one(points, {
        fields: [schedulePoints.pointId],
        references: [points.id],
    }),
    pointer: one(schedulePointPointers, {
        fields: [schedulePoints.schedulePointPointerId],
        references: [schedulePointPointers.id],
    }),
}));

export type Project = typeof projects.$inferSelect;
export type Point = typeof points.$inferSelect;
export type Geometry = typeof geometries.$inferSelect;
export type GeometryPoint = typeof geometryPoints.$inferSelect;
export type SafetyEquipmentType = typeof safetyEquipmentTypes.$inferSelect;
export type SafetyEquipmentTypeLength = typeof safetyEquipmentTypeLengths.$inferSelect;
export type PointToSecure = typeof pointsToSecure.$inferSelect;
export type PointToSecurePhoto = typeof pointToSecurePhotos.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Schedule = typeof schedules.$inferSelect;
export type SchedulePointPointer = typeof schedulePointPointers.$inferSelect;
export type SchedulePoint = typeof schedulePoints.$inferSelect;