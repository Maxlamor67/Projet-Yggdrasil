import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import { format, type Locale } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface DateAndTimePickerProps {
  /** Valeur de la date complète (Date et heure) */
  value: Date | undefined;
  /** Fonction appelée quand la date change */
  onChange: (date: Date | undefined) => void;
  /** Label pour le champ date */
  dateLabel?: string;
  /** Label pour le champ heure */
  timeLabel?: string;
  /** ID du composant pour l'accessibilité */
  id?: string;
  /** Placeholder pour le champ date */
  placeholder?: string;
  /** Format d'affichage de la date */
  dateFormat?: string;
  /** Si le champ est désactivé */
  disabled?: boolean;
  /** Précision des secondes (par défaut false = format HH:mm) */
  showSeconds?: boolean;
  /** Locale pour l'affichage de la date (par défaut fr) */
  locale?: Locale;
  /** Classes CSS supplémentaires */
  className?: string;
}

export function DateAndTimePicker({
  value,
  onChange,
  dateLabel = "Date",
  timeLabel = "Heure",
  id = "date-time-picker",
  placeholder = "Sélectionner une date",
  dateFormat = "PPP",
  disabled = false,
  showSeconds = false,
  locale = fr,
  className,
}: DateAndTimePickerProps) {
  const [open, setOpen] = useState(false);
  const timeStep = showSeconds ? 1 : 60;

  // Formate la date pour l'affichage
  const formattedDate = value
    ? format(value, dateFormat, { locale })
    : placeholder;

  // Formate l'heure pour l'input time (format HH:mm:ss ou HH:mm)
  const formatTimeForInput = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (showSeconds) {
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }

    return `${hours}:${minutes}`;
  };

  // Gère le changement de date
  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) {
      onChange(undefined);
      return;
    }

    // Si on a déjà une date avec une heure, on la conserve
    if (value) {
      const updatedDate = new Date(newDate);
      updatedDate.setHours(value.getHours());
      updatedDate.setMinutes(value.getMinutes());
      updatedDate.setSeconds(value.getSeconds());
      onChange(updatedDate);
    } else {
      // Nouvelle date, on met l'heure à maintenant
      const now = new Date();
      const updatedDate = new Date(newDate);
      updatedDate.setHours(now.getHours());
      updatedDate.setMinutes(now.getMinutes());
      updatedDate.setSeconds(0);
      onChange(updatedDate);
    }

    setOpen(false);
  };

  // Gère le changement d'heure
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!value) {
      // Si pas de date, on crée une date avec aujourd'hui
      const today = new Date();
      const [hours, minutes, seconds = "0"] = e.target.value.split(":");
      today.setHours(parseInt(hours, 10));
      today.setMinutes(parseInt(minutes, 10));
      today.setSeconds(parseInt(seconds, 10));
      onChange(today);
    } else {
      // On met à jour l'heure de la date existante
      const [hours, minutes, seconds = "0"] = e.target.value.split(":");
      const updatedDate = new Date(value);
      updatedDate.setHours(parseInt(hours, 10));
      updatedDate.setMinutes(parseInt(minutes, 10));
      updatedDate.setSeconds(parseInt(seconds, 10));
      onChange(updatedDate);
    }
  };

  return (
    <div className={cn("flex gap-4", className)}>
      {/* Sélecteur de date */}
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-date`} className="px-1 text-sm font-medium">
          {dateLabel}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={`${id}-date`}
              disabled={disabled}
              className={cn(
                "w-full justify-between font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <span>{formattedDate}</span>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateChange}
              locale={locale}
              disabled={disabled}
              classNames={{
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Sélecteur d'heure */}
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-time`} className="px-1 text-sm font-medium">
          {timeLabel}
        </Label>
        <div className="relative">
          <Input
            type="time"
            id={`${id}-time`}
            step={timeStep}
            value={value ? formatTimeForInput(value) : ""}
            onChange={handleTimeChange}
            disabled={disabled || !value}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          {!value && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
              <span className="text-sm text-muted-foreground">
                Sélectionnez d'abord une date
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
