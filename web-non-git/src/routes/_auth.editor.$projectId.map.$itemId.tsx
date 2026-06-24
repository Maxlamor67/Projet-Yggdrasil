import { SelectScrollable } from "@/components/SelectScrollable";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_auth/editor/$projectId/map/$itemId")({
  component: () => {
    const { itemId } = Route.useParams();
    return <PoIOutlet itemId={itemId} />;
  },
});

function PoIOutlet({ itemId }: { itemId: string }) {
  const [selectedEquipmentType, setselectedEquipmentType] =
    useState<string>("None");
  const [value, setValue] = useState<number | undefined>();
  const [comment, setComment] = useState<string>("None");

  function functionConfirm() {
    console.log("Confirmed infos for Item " + itemId + " : ");
    console.log("value : " + value);
    console.log("selectedEquipmentType : " + selectedEquipmentType);
    console.log("comment : " + comment);
  }
  return (
    <ScrollArea className="rounded-lg border shadow dark:bg-neutral-900">
      <div className="flex flex-col gap-4 p-4">
        <h1 className="mb-2 text-2xl font-bold">Détails de l’item {itemId}</h1>
        <h2 className="mb-2 text-xl font-bold">Type d'équipement</h2>
        <Select onValueChange={setselectedEquipmentType}>
          <SelectTrigger>
            <SelectValue placeholder="Type d'équipement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Barr_V">Barrières Vauban</SelectItem>
            <SelectItem value="Barr_H">Barrières Héras</SelectItem>
            <SelectItem value="Obstacles">Obstacles</SelectItem>
          </SelectContent>
        </Select>
        <Separator />
        <h2 className="mb-2 text-xl font-bold">Heure de pose</h2>
        <SelectScrollable /> <Separator />
        <h2 className="mb-2 text-xl font-bold">Heure de retrait</h2>
        <SelectScrollable /> <Separator />
        <h2 className="mb-2 text-xl font-bold">Quantité</h2>
        <Input
          type="number"
          value={value || "0"}
          onChange={(e) => setValue(Math.max(0, Number(e.target.value)))}
          placeholder="2"
        />
        <Separator />
        <h2 className="mb-2 text-xl font-bold">Commentaire</h2>
        <Textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          placeholder="Type your message here."
          defaultValue={comment}
        />
        <h2 className="mb-2 text-xl font-bold">Images</h2>
        <AspectRatio ratio={16 / 9}>
          <iframe
            src="https://www.youtube.com/embed/tgbNymZ7vqY"
            title="YouTube video player"
            allowFullScreen
          ></iframe>
        </AspectRatio>
        <Separator />
        <Button className="bg-green-400" onClick={functionConfirm}>
          Confirmer
        </Button>
      </div>
    </ScrollArea>
  );
}
