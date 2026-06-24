// TimelineController.tsx - Composant principal de la Timeline

import { useState, useEffect } from "react";
import { mockSafetyEquipmentTypes } from "./timelineData";
import {
  generateTimelineSteps,
  getActiveSafetyEquipments,
  formatDateTime,
} from "./timelineUtils";
import { TimelineBar } from "./TimelineBar";
import type {
  SafetyEquipment,
  SafetyEquipmentType,
  Action,
} from "@/types/temp.ts";
import type { TimelineStep } from "@/types/timeline.ts";

interface TimelineControllerProps {
  actions: Action[];
  safetyEquipments: SafetyEquipment[];
  safetyEquipmentTypes?: SafetyEquipmentType[];
  onActiveSafetyEquipmentsChange?: (
    activeEquipments: SafetyEquipment[]
  ) => void;
}

export function TimelineController({
  actions,
  safetyEquipments,
  safetyEquipmentTypes = mockSafetyEquipmentTypes, // TODO Besoin de l'API
  onActiveSafetyEquipmentsChange,
}: TimelineControllerProps) {
  // État principal
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Générer les steps au chargement et quand les données changent
  useEffect(() => {
    const steps = generateTimelineSteps(
      actions,
      safetyEquipments,
      safetyEquipmentTypes
    );
    setTimelineSteps(steps);
    setCurrentStepIndex(0); // Reset au début
  }, [actions, safetyEquipments, safetyEquipmentTypes]);

  // Logique du mode Play automatique
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && timelineSteps.length > 0) {
      interval = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          // Si on arrive à la fin, on arrête
          if (prevIndex >= timelineSteps.length - 1) {
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, 500); // 2 actions par seconde = 500ms
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timelineSteps.length]);

  // Calculer les équipements actifs et notifier le parent (pour la carte)
  useEffect(() => {
    if (timelineSteps.length > 0 && timelineSteps[currentStepIndex]) {
      const currentDatetime = timelineSteps[currentStepIndex].datetime;

      const activeEquipments = getActiveSafetyEquipments(
        currentDatetime,
        actions,
        safetyEquipments
      );

      if (onActiveSafetyEquipmentsChange) {
        onActiveSafetyEquipmentsChange(activeEquipments);
      }
    }
  }, [
    currentStepIndex,
    timelineSteps,
    actions,
    safetyEquipments,
    onActiveSafetyEquipmentsChange,
  ]);

  // Handlers
  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < timelineSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Cas où il n'y a pas d'équipements
  if (timelineSteps.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-gray-600">
          Aucun équipement à afficher sur la timeline
        </p>
      </div>
    );
  }

  const currentStep = timelineSteps[currentStepIndex];
  const canGoPrev = currentStepIndex > 0;
  const canGoNext = currentStepIndex < timelineSteps.length - 1;

  return (
    <div
      className="w-full h-full p-3 bg-white flex flex-col"
      style={{ overflow: "visible" }}
    >
      <h3 className="text-sm font-bold mb-2">
        Timeline - Événement : {formatDateTime(currentStep.datetime)}
      </h3>

      {/* TimelineBar */}
      <TimelineBar
        steps={timelineSteps}
        currentIndex={currentStepIndex}
        onStepClick={(index) => !isPlaying && setCurrentStepIndex(index)}
        disabled={isPlaying}
      />

      {/* Contrôles */}
      <div className="flex gap-2 justify-center mb-2">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev || isPlaying}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          ◀️ Prev
        </button>

        <button
          onClick={handleTogglePlay}
          className="px-4 py-1 text-sm bg-blue-500 text-white rounded 
                     hover:bg-blue-600 transition-colors font-medium"
        >
          {isPlaying ? "⏸️ Pause" : "▶️ Play"}
        </button>

        <button
          onClick={handleNext}
          disabled={!canGoNext || isPlaying}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          Next ▶️
        </button>
      </div>
    </div>
  );
}
