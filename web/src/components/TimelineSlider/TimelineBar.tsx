// TimelineBar.tsx - Barre de timeline avec points d'actions (version compacte)

import { getStepColor, formatDateTimeShort } from "./timelineUtils";
import type {TimelineStep} from "@/types/timeline.ts";

interface TimelineBarProps {
  steps: TimelineStep[];
  currentIndex: number;
  onStepClick?: (index: number) => void;
  disabled?: boolean;
}

export function TimelineBar({
  steps,
  currentIndex,
  onStepClick,
  disabled = false,
}: TimelineBarProps) {
  if (steps.length === 0) {
    return null;
  }

  const firstStep = steps[0];
  const lastStep = steps[steps.length - 1];
  const currentStep = steps[currentIndex];

  return (
    <div className="w-full py-2 px-4">
      {/* Conteneur de la timeline - version compacte avec overflow visible */}
      <div className="relative h-16 mb-2" style={{ overflow: "visible" }}>
        {/* Ligne de base */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -translate-y-1/2" />

        {/* Points d'action */}
        {steps.map((step, index) => {
          const position =
            steps.length > 1 ? (index / (steps.length - 1)) * 100 : 50;
          const color = getStepColor(step.actions.map(a => a.action));
          const count = step.actions.length;
          const isActive = index === currentIndex;

          // Classes de couleur selon le type
          const colorClasses = {
            green: "bg-green-500 border-green-600",
            red: "bg-red-500 border-red-600",
            orange: "bg-orange-500 border-orange-600",
          };

          return (
            <div
              key={index}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer group"
              style={{ left: `${position}%` }}
              onClick={() => !disabled && onStepClick?.(index)}
            >
              {/* Point */}
              <div
                className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200
                  ${colorClasses[color]}
                  ${isActive ? "scale-100" : "scale-75"}
                  ${!disabled ? "hover:scale-125" : ""}
                  ${disabled ? "cursor-not-allowed opacity-60" : ""}
                `}
              >
                {/* Badge de count si > 1 */}
                {count > 1 && (
                  <span className="text-white text-[9px] font-bold">
                    {count}
                  </span>
                )}
              </div>

              {/* Tooltip au hover */}
              <div
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                              opacity-0 group-hover:opacity-100 
                              transition-opacity duration-200 pointer-events-none
                              whitespace-nowrap z-10"
              >
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                  <div className="font-semibold mb-1">
                    {formatDateTimeShort(step.datetime)}
                  </div>
                  <div className="text-gray-300">
                    {count} action{count > 1 ? "s" : ""}
                  </div>
                  {/* Liste des équipements */}
                  <div className="mt-1 text-left max-w-xs">
                    {step.actions.slice(0, 3).map((item, i) => (
                      <div key={i} className="text-[10px]">
                        {item.action.type === "SET" ? "🟢" : "🔴"}{" "}
                        {item.safetyEquipmentType.name}
                      </div>
                    ))}
                    {step.actions.length > 3 && (
                      <div className="text-[10px] text-gray-400">
                        +{step.actions.length - 3} autre
                        {step.actions.length - 3 > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </div>
                {/* Petite flèche */}
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 
                                border-4 border-transparent border-t-gray-900"
                />
              </div>
            </div>
          );
        })}

        {/* Curseur actuel (gros point bleu) avec tooltip */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ease-out z-10 group"
          style={{
            left:
              steps.length > 1
                ? `${(currentIndex / (steps.length - 1)) * 100}%`
                : "50%",
          }}
        >
          <div className="relative">
            {/* Cercle extérieur animé */}
            <div
              className="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full 
                            animate-ping opacity-75"
            />
            {/* Cercle principal */}
            <div
              className="relative w-6 h-6 bg-blue-600 rounded-full 
                            border-3 border-white shadow-lg"
            />
          </div>

          {/* Tooltip du curseur */}
          <div
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                          opacity-0 group-hover:opacity-100 
                          transition-opacity duration-200 pointer-events-none
                          whitespace-nowrap z-20"
          >
            <div className="bg-blue-900 text-white text-xs px-2 py-1 rounded shadow-lg">
              <div className="font-semibold mb-1">
                {formatDateTimeShort(currentStep.datetime)}
              </div>
              <div className="text-blue-200">
                {currentStep.actions.length} action
                {currentStep.actions.length > 1 ? "s" : ""}
              </div>
              {/* Liste des équipements */}
              <div className="mt-1 text-left max-w-xs">
                {currentStep.actions.slice(0, 3).map((item, i) => (
                  <div key={i} className="text-[10px]">
                    {item.action.type === "SET" ? "🟢" : "🔴"}{" "}
                    {item.safetyEquipmentType.name}
                  </div>
                ))}
                {currentStep.actions.length > 3 && (
                  <div className="text-[10px] text-blue-300">
                    +{currentStep.actions.length - 3} autre
                    {currentStep.actions.length - 3 > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
            {/* Petite flèche */}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 
                            border-4 border-transparent border-t-blue-900"
            />
          </div>
        </div>

        {/* Dates début et fin  */}
        <div className="absolute top-0 left-0 right-0">
          {/* Date de début - centrée sur son point */}
          <div
            className="absolute -translate-x-1/2 text-center"
            style={{ left: "0%" }}
          >
            <div className="text-xs font-medium text-gray-700 whitespace-nowrap">
              {formatDateTimeShort(firstStep.datetime)}
            </div>
          </div>

          {/* Date de fin - centrée sur son point */}
          <div
            className="absolute -translate-x-1/2 text-center"
            style={{ left: "100%" }}
          >
            <div className="text-xs font-medium text-gray-700 whitespace-nowrap">
              {formatDateTimeShort(lastStep.datetime)}
            </div>
          </div>
        </div>
      </div>

      {/* Légende des couleurs - version compacte */}
      <div className="flex gap-3 justify-center text-[10px] text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Mise en place</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Retrait</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span>Mixte</span>
        </div>
      </div>
    </div>
  );
}
