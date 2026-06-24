import { type FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateAndTimePicker } from "../DateAndTimePicker";
import type { CreateProjectDto, UpdateProjectDto, Project } from "@/api";

type ProjectFormProps = {
  mode: "create" | "edit";

  // en edit, tu peux passer le project pour préremplir correctement
  project?: Project | null;

  onCancel: () => void;
  onSubmit: (data: CreateProjectDto | UpdateProjectDto) => void;
};

/** Parse ISO string -> Date (undefined si invalide) */
function parseIsoDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Date -> ISO string (undefined si undefined) */
function toIso(value: Date | undefined): string | undefined {
  return value ? value.toISOString() : undefined;
}

export function ProjectForm({ mode, project, onCancel, onSubmit }: ProjectFormProps) {
  const initialName = project?.name ?? "";
  const initialStart = useMemo(() => parseIsoDate(project?.startAtDate), [project?.startAtDate]);
  const initialEnd = useMemo(() => parseIsoDate(project?.endAtDate), [project?.endAtDate]);

  const [name, setName] = useState(initialName);
  const [startAt, setStartAt] = useState<Date | undefined>(initialStart);
  const [endAt, setEndAt] = useState<Date | undefined>(initialEnd);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmed = name.trim();
    if (trimmed.length < 3) return;

    if (startAt && endAt && endAt.getTime() < startAt.getTime()) {
      alert("La date de fin doit être après la date de début.");
      return;
    }

    const dto: CreateProjectDto | UpdateProjectDto = {
      name: trimmed,
      startAtDate: toIso(startAt),
      endAtDate: toIso(endAt),
    };

    onSubmit(dto);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-sm font-medium">Nom du projet</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={3}
        />
      </div>

      <div className="space-y-1">
        <DateAndTimePicker
          id="project-start"
          dateLabel="Début"
          timeLabel="Heure"
          value={startAt}
          onChange={(d) => setStartAt(d)}
        />
      </div>

      <div className="space-y-1">
        <DateAndTimePicker
          id="project-end"
          dateLabel="Fin"
          timeLabel="Heure"
          value={endAt}
          onChange={(d) => setEndAt(d)}
          disabled={!startAt}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button className='cursor-pointer' type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button className='cursor-pointer' type="submit" disabled={!endAt || !startAt || name.length < 3}>
          {mode === "create" ? "Créer" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
