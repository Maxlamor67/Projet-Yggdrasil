import {Button} from "@/components/ui/button.tsx";
import {Redo2, Undo2} from "lucide-react";
import type {Course} from "@/types/geometry.ts";

interface DrawingMessageProps {
    undoStack: Course[];
    redoStack: Course[];
    handleUndo: () => void;
    handleRedo: () => void;
}

export default function UndoRedoButtons({ undoStack, redoStack, handleUndo, handleRedo } : DrawingMessageProps) {
    return (
        <div>
            <Button disabled={undoStack.length == 0} onClick={handleUndo} variant="ghost" size="icon" className='h-8 w-8 hover:bg-gray-100 cursor-pointer'>
                <Undo2 size={32} />
            </Button>
            <Button disabled={redoStack.length == 0} onClick={handleRedo} variant="ghost" size="icon" className='h-8 w-8 hover:bg-gray-100 cursor-pointer'>
                <Redo2 size={32}/>
            </Button>
        </div>
    )
}