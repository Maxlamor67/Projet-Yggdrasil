import {Marker, Popup} from "react-leaflet";
import L, { type Marker as LeafletMarker } from "leaflet";
import type {GetAllPointsToSecureResponse as SecurityPoint} from "@/api";
import { renderToString } from "react-dom/server";
import { useMemo, useRef } from "react";
import { Move } from "lucide-react";
import { Button } from "@/components/ui/button.tsx"

interface InterestPointMarkerProps {
  point: SecurityPoint;
  editedPoint: SecurityPoint | null;
  setEditedPoint: (point: SecurityPoint) => void;
  selectedPoint: SecurityPoint | null;
  handleSelectPoint: (point: SecurityPoint) => void;
  drawingMode: string | null;
  setDrawingMode: (mode: string | null) => void;
}

export default function SecurityPointMarker({
  point,
  selectedPoint,
  handleSelectPoint,
  drawingMode,
  editedPoint,
  setEditedPoint,
  setDrawingMode
}: InterestPointMarkerProps) {
  const markerRef = useRef<LeafletMarker>(null);
  const isEditable = drawingMode === "editPoint" && point.id === editedPoint?.id;

  const getLatLng = (p: SecurityPoint) => ({
    lat: p.point.latitude,
    lng: p.point.longitude,
  });

  const eventHandlers = useMemo(
    () => ({
      click: () => {
        handleSelectPoint(point);
      },
      dragend() {
        const marker = markerRef.current;
        if (!marker || !editedPoint) return;

        const ll = marker.getLatLng();
        setEditedPoint({
          ...editedPoint,
          point: {
            ...editedPoint.point,
            latitude: ll.lat,
            longitude: ll.lng,
          },
        });
      },
    }),
    [editedPoint, handleSelectPoint, point, setEditedPoint]
  );

  const arePointsEqual = (
    p1: SecurityPoint,
    p2: SecurityPoint | null
  ): boolean => {
    if (!p2) return false;
    const tolerance = 0.000001;

    const a = getLatLng(p1);
    const b = getLatLng(p2);

    return (
      Math.abs(a.lat - b.lat) < tolerance && Math.abs(a.lng - b.lng) < tolerance
    );
  };

  const handleEdit = () => {
    setDrawingMode("editPoint");
    setEditedPoint(point);
  }

  const getPointIcon = () => {
    const isSelected = arePointsEqual(point, selectedPoint);

    return L.divIcon({
      html: renderToString(
        <div className="relative flex flex-col items-center">
          <div className="relative flex items-center justify-center z-10">
            <span
              className={`h-6 w-6 rounded-full shadow-lg border-2 border-white ${
                isSelected ? "bg-red-500" : "bg-gray-500"
              }`}
            />
            <span
              className={`absolute -bottom-1 h-2 w-2 rotate-45 ${
                isSelected ? "bg-red-500" : "bg-gray-500"
              }`}
            />
          </div>

          {isEditable && (
            <div className="-mt-2 relative z-0">
              <Move
                className="h-6 w-6 text-blue-600 drop-shadow-md"
                strokeWidth={2.5}
              />
            </div>
          )}
        </div>
      ),
      className: "",
      iconSize: [32, isEditable ? 42 : 28],
      iconAnchor: [16, isEditable ? 28 : 24],
    });
  };

  // coords
  const base = getLatLng(point);
  const edited = editedPoint ? getLatLng(editedPoint) : null;

  return (
    <Marker
      ref={markerRef}
      draggable={isEditable}
      key={point.id}
      position={
        isEditable && edited ? [edited.lat, edited.lng] : [base.lat, base.lng]
      }
      icon={getPointIcon()}
      eventHandlers={eventHandlers}
    >
      { !editedPoint &&
        <Popup>
          <div className="flex flex-col gap-3 max-w-xs">
            <Button
                onClick={handleEdit}
                size="sm"
                className="hover:cursor-pointer"
            >
              Déplacer
            </Button>
          </div>
        </Popup>
      }
    </Marker>

  );
}
