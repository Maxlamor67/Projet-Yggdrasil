import React, { createContext, useContext, useState, ReactNode } from "react";

export interface PointOfInterest {
  id: string;
  title: string;
  blockType?: string;
  comment?: string;
  photoUris?: string[];
  latitude: number;
  longitude: number;
}

interface PoiContextValue {
  pois: PointOfInterest[];
  addPoi: (poi: Omit<PointOfInterest, "id">) => string;
  getPoiById: (id: string) => PointOfInterest | undefined;
  deletePoi: (id: string) => void;
  deleteManyPois: (ids: string[]) => void;
  updatePoi: (id: string, coords: { latitude: number; longitude: number }) => void;
}

const PoiContext = createContext<PoiContextValue | undefined>(undefined);

export const PoiProvider = ({ children }: { children: ReactNode }) => {
  const [pois, setPois] = useState<PointOfInterest[]>([]);

  const addPoi: PoiContextValue["addPoi"] = (poi) => {
    const id = Date.now().toString();
    setPois((prev) => [...prev, { id, ...poi }]);
    return id;
  };

  const updatePoi: PoiContextValue["updatePoi"] = (id, coords) => {
    setPois((prev) => prev.map((p) => (p.id === id ? { ...p, latitude: coords.latitude, longitude: coords.longitude } : p)));
  };

  const getPoiById = (id: string) => pois.find((p) => p.id === id);

  const deletePoi = (id: string) => {
    setPois((prev) => prev.filter((p) => p.id !== id));
  };

  const deleteManyPois = (ids: string[]) => {
    setPois((prev) => prev.filter((p) => !ids.includes(p.id)));
  };

  return (
    <PoiContext.Provider
      value={{ pois, addPoi, getPoiById, deletePoi, deleteManyPois, updatePoi }}
    >
      {children}
    </PoiContext.Provider>
  );
};

export const usePoiContext = () => {
  const ctx = useContext(PoiContext);
  if (!ctx) {
    throw new Error("usePoiContext must be used inside PoiProvider");
  }
  return ctx;
};
