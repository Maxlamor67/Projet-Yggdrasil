import {Button} from "@/components/ui/button.tsx";
import {Check, CircleX, Trash2} from "lucide-react";
import {useState} from "react";

interface DeleteButtonProps {
    deleteFunction: () => void;
}

export default function DeleteButton({ deleteFunction } : DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDelete = () => {
        setIsDeleting(false);
        deleteFunction();
    }

    return (
        <div className='flex items-center w-20'>
            {
                isDeleting ?
                    <>
                        <Button onClick={() => setIsDeleting(false)} variant="ghost" size="icon" className='h-8 w-8 hover:bg-gray-100 cursor-pointer'>
                            <CircleX size={32}/>
                        </Button>
                        <Button onClick={handleDelete} variant="ghost" size="icon" className='h-8 w-8 hover:bg-gray-100 cursor-pointer'>
                            <Check size={32}/>
                        </Button>
                    </> :
                    <>
                        <Button onClick={() => setIsDeleting(true)} variant="ghost" size="icon" className='h-8 w-8 hover:bg-gray-100 cursor-pointer'>
                            <Trash2 size={32}/>
                        </Button>
                    </>
            }
        </div>
    )
}