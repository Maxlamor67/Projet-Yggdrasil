import React, { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

type ListViewerProps<T> = {
  items: T[];
  getId: (item: T) => string | number;
  getLabel: (item: T) => string;
  getAvatarLetters?: (item: T) => string;
  showAvatar?: boolean;
  filters?: string[];
  title?: string;
  className?: string;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onItemClick?: (item: T) => void;

  // ✅ NEW: custom per-item actions (optional)
  renderActions?: (item: T) => React.ReactNode;
};

export default function ListViewer<T>({
  items,
  getId,
  getLabel,
  getAvatarLetters,
  showAvatar = true,
  filters = ["All"],
  title = "Items",
  className,
  onAdd,
  onEdit,
  onDelete,
  renderActions,
  onItemClick
}: ListViewerProps<T>) {
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  const filteredItems =
    selectedFilter === "All"
      ? items
      : items.filter((item: any) => item.team === selectedFilter);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 w-full flex-1 p-4 rounded-md border",
        className
      )}
    >
      {/* ---- TOP BAR ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          {title}
        </h1>

        <div className="flex items-center gap-3">
          <Button className='cursor-pointer' onClick={onAdd}>Ajouter</Button>

          {/* J'ai mis en commentaire pcq ce n'est plus utile
          
           {filters.length > 0 && (
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                {filters.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} */}
        </div>
      </div>

      {/* ---- LIST ---- */}
      <ScrollArea className="flex-1 rounded-md border p-2">
        <div className="flex flex-col gap-3">
          {filteredItems.map((item) => {
            const id = getId(item);
            const label = getLabel(item);
            const avatarLetters = getAvatarLetters?.(item);

            return (
                <div
                    key={id}
                    className={cn(
                        "w-full rounded-xl border bg-card text-card-foreground shadow p-4 flex items-center justify-between",
                        onItemClick && "cursor-pointer hover:bg-accent transition-colors"
                    )}
                    onClick={() => onItemClick?.(item)}
                >
                {/* LEFT */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {showAvatar && (
                    <Avatar>
                      <AvatarFallback>
                        {avatarLetters ?? label.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <p className="font-medium truncate min-w-0">{label}</p>
                </div>

                {/* RIGHT: Custom actions + Edit/Delete */}
                <div className="flex items-center gap-2">
                  {renderActions?.(item)}

                  {onEdit && (
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(item)
                      }}
                      className='cursor-pointer'
                    >
                      <Pencil className="size-4" />
                    </Button>
                  )}

                  {onDelete && (
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(item)
                      }}
                      className='cursor-pointer'
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
