import {Check, CircleX} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

interface CancelValidButtonsProps {
    handleCancel: () => void;
    handleValidate: () => void;
}

export default function CancelValidButtons({ handleValidate, handleCancel } : CancelValidButtonsProps) {
    return (
        <div className='flex gap-2 items-center'>
            <Button onClick={handleCancel} className=" bg-gray-500 hover:bg-gray-600 hover:cursor-pointer font-medium cursor-pointer h-9 px-3 shadow-sm" >
                <CircleX strokeWidth={2.5} /> Annuler
            </Button>
            <Button onClick={handleValidate} className=' bg-green-500 hover:bg-green-600 text-white border-2 border-green-500 hover:border-green-600 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md'>
                <Check strokeWidth={2.5} /> Valider
            </Button>
        </div>
    )
}