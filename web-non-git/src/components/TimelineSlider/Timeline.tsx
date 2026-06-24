import { useState, useEffect, useRef } from "react";
import { Play, Pause, Calendar, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateAndTimePicker } from "@/components/DateAndTimePicker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { GetAllSafetyEquipmentsResponse } from "@/api";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type TimelineSpeed = "10min" | "30min" | "1h" | "3h";

type TimelineProps = {
  projectStart: string;
  projectEnd: string;
  equipments: GetAllSafetyEquipmentsResponse[];
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  onActiveSafetyEquipmentsChange: (
    filteredEquipments: GetAllSafetyEquipmentsResponse[]
  ) => void;
};

// Convertit la vitesse en millisecondes par seconde réelle
const SPEED_TO_MS: Record<TimelineSpeed, number> = {
  "10min": 10 * 60 * 1000,
  "30min": 30 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "3h": 3 * 60 * 60 * 1000,
};

export function Timeline({
  projectStart,
  projectEnd,
  equipments,
  onActiveSafetyEquipmentsChange,
  isPlaying,
  setIsPlaying
}: TimelineProps) {
  const startDate = new Date(projectStart);
  const endDate = new Date(projectEnd);
  const totalDuration = endDate.getTime() - startDate.getTime();

  const [currentTime, setCurrentTime] = useState<Date>(startDate);
  const [speed, setSpeed] = useState<TimelineSpeed>("1h");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isTimelineActive, setIsTimelineActive] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  const onChangeRef = useRef(onActiveSafetyEquipmentsChange);

  // Mettre à jour la ref quand la callback change
  useEffect(() => {
    onChangeRef.current = onActiveSafetyEquipmentsChange;
  }, [onActiveSafetyEquipmentsChange]);

  // Calcule le pourcentage de progression
  const progress =
    ((currentTime.getTime() - startDate.getTime()) / totalDuration) * 100;

  // Gère le play/pause
  useEffect(() => {
    if (isPlaying) {
      lastUpdateRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const deltaRealTime = now - lastUpdateRef.current;
        lastUpdateRef.current = now;

        setCurrentTime((prevTime) => {
          const timelineIncrement = (deltaRealTime / 1000) * SPEED_TO_MS[speed];
          const newTime = new Date(prevTime.getTime() + timelineIncrement);

          if (newTime.getTime() >= endDate.getTime()) {
            setIsPlaying(false);
            return endDate;
          }

          return newTime;
        });
      }, 50);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, endDate]);

  // Callback quand le temps change - Filtre les équipements actifs
  useEffect(() => {
    if (!isTimelineActive) {
      console.log("Timeline inactive - Affichage de tous les équipements");
      onChangeRef.current(equipments);
      return;
    }

    if (!equipments || equipments.length === 0) {
      return;
    }

    const filteredEquipments = equipments.filter((equipment) => {
      const setAction = equipment.actions
        .filter((action) => action.type === "SET")
        .sort(
          (a, b) =>
            new Date(b.realizedAt).getTime() - new Date(a.realizedAt).getTime()
        )[0];

      const unsetAction = equipment.actions
        .filter((action) => action.type === "UNSET")
        .sort(
          (a, b) =>
            new Date(b.realizedAt).getTime() - new Date(a.realizedAt).getTime()
        )[0];

      if (!setAction) return false;

      const setDate = new Date(setAction.realizedAt);
      const currentTimestamp = currentTime.getTime();

      if (!unsetAction) {
        return currentTimestamp >= setDate.getTime();
      }

      const unsetDate = new Date(unsetAction.realizedAt);

      return (
        currentTimestamp >= setDate.getTime() &&
        currentTimestamp <= unsetDate.getTime()
      );
    });

    console.log(
      "Equipments filtered à ",
      currentTime,
      " : ",
      filteredEquipments
    );

    onChangeRef.current(filteredEquipments);
  }, [currentTime, equipments, isTimelineActive]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const newTime = new Date(
      startDate.getTime() + (totalDuration * value) / 100
    );
    setCurrentTime(newTime);
  };

  const handleDateTimeChange = (newDate: Date | undefined) => {
    if (newDate) {
      const clampedTime = Math.max(
        startDate.getTime(),
        Math.min(newDate.getTime(), endDate.getTime())
      );
      setCurrentTime(new Date(clampedTime));
      setDatePickerOpen(false);
    }
  };

  const togglePlay = () => {
    if (!isTimelineActive) {
      setIsTimelineActive(true);
    }

    if (currentTime.getTime() >= endDate.getTime()) {
      setCurrentTime(startDate);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg border border-slate-200 p-6 flex flex-col justify-center gap-4">
      {/* Titre et statut */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-800">
            Timeline du Projet
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isTimelineActive
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {isTimelineActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-slate-700 hidden sm:block">
            Date précise:
          </Label>

          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-3 font-medium"
                disabled={!isTimelineActive}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {format(currentTime, "dd/MM/yyyy HH:mm", { locale: fr })}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-4" align="end">
              <DateAndTimePicker
                value={currentTime}
                onChange={handleDateTimeChange}
                dateLabel="Date"
                timeLabel="Heure"
                placeholder="Choisir une date"
                showSeconds={false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Slider en haut */}
      <div className={`relative ${!isTimelineActive ? "opacity-50" : ""}`}>
        {/* Slider Track */}
        <div className="relative h-2 bg-slate-200 rounded-full">
          {/* Progress Bar */}
          <div
            className="absolute h-full bg-blue-600 rounded-full transition-all duration-100"
            style={{ width: `${Math.min(progress, 100)}%` }}
            aria-hidden="true"
          ></div>

          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSliderChange}
            className="absolute w-full h-2 opacity-0 cursor-pointer z-20"
            aria-label="Curseur de temps"
            disabled={!isTimelineActive}
          />

          {/* Custom Thumb */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-3 border-blue-600 rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                  style={{ left: `calc(${Math.min(progress, 100)}% - 10px)` }}
                />
              </TooltipTrigger>

              <TooltipContent
                side="top"
                align="center"
                className="bg-slate-800 text-white text-xs font-medium px-3 py-1.5 shadow-lg"
              >
                {format(currentTime, "dd/MM HH:mm", { locale: fr })}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Start and End Labels */}
        <div className="flex justify-between mt-2 text-xs text-slate-600">
          <div className="flex flex-col">
            <span className="font-medium text-slate-500">Début</span>
            <span className="font-semibold">
              {format(startDate, "dd/MM/yyyy HH:mm", { locale: fr })}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="font-medium text-slate-500">Fin</span>
            <span className="font-semibold">
              {format(endDate, "dd/MM/yyyy HH:mm", { locale: fr })}
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex items-center gap-4">
        {/* Gauche */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsTimelineActive(!isTimelineActive)}
            variant={isTimelineActive ? "default" : "outline"}
            size="lg"
            className={`h-11 px-4 transition-colors ${
              isTimelineActive
                ? "bg-green-600 hover:bg-green-700"
                : "hover:bg-slate-100"
            }`}
          >
            <Power
              className={`h-5 w-5 mr-2 ${isTimelineActive ? "text-white" : ""}`}
            />
            <span className="font-medium">
              {isTimelineActive ? "Désactiver" : "Activer"}
            </span>
          </Button>
        </div>

        {/* Centre — FORCÉ AU CENTRE */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <Button
            onClick={togglePlay}
            size="lg"
            className="h-11 w-11"
            disabled={!isTimelineActive}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Label
              htmlFor="speed-select"
              className="text-sm font-medium text-slate-700"
            >
              Vitesse:
            </Label>
            <Select
              value={speed}
              onValueChange={(value) => setSpeed(value as TimelineSpeed)}
              disabled={!isTimelineActive}
            >
              <SelectTrigger id="speed-select" className="w-[110px] h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10min">10 min/s</SelectItem>
                <SelectItem value="30min">30 min/s</SelectItem>
                <SelectItem value="1h">1 h/s</SelectItem>
                <SelectItem value="3h">3 h/s</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
