import type { LatLngTuple } from "leaflet";

export interface ApiGeometrySummary {
    id: string;
    type: "AREA" | "ROUTE";
}

export interface ApiPoint {
    latitude: number;
    longitude: number;
    rank: number;
}

export type GeometryWithId = {
    geometryId: string,
    points: Geometry
}

// Géométrie
export type Geometry = Course | Area | PolylineEquipment;

// Parcours
export type Course = LatLngTuple[];

// Zone
export type Area = LatLngTuple[];

// Equipement
export type Equipment = PolylineEquipment | PointEquipment;

// Equipement Polyligne (Obstacle)
export type PolylineEquipment = LatLngTuple[];

// Equipement Point (Véhicule)
export type PointEquipment = LatLngTuple;
