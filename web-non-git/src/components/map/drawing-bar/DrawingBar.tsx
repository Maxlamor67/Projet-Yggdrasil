import DrawingMessage from "@/components/map/drawing-bar/DrawingMessage.tsx";
import type {Course} from "@/types/geometry.ts";
import {useEffect, useRef} from "react";
import L from "leaflet";
import CancelValidButtons from "@/components/map/drawing-bar/CancelValidButtons.tsx";
import UndoRedoButtons from "@/components/map/drawing-bar/UndoRedoButtons.tsx";
import DeleteButton from "@/components/map/drawing-bar/DeleteButton.tsx";
import {Button} from "@/components/ui/button.tsx";

interface DrawingMessageProps {
    warning: string | null;
    drawingMode: string | null;
    undoStack: Course[];
    redoStack: Course[];
    handleUndo: () => void;
    handleRedo: () => void;
    handleCancel: () => void;
    handleValidate: () => void;
    handleFinish: () => void;
    deleteGeometry: () => void;
    handleResetEditedPointPosition: () => void
}

export default function DrawingBar({
    warning,
    drawingMode,
    undoStack,
    redoStack,
    handleUndo,
    handleRedo,
    handleValidate,
    handleCancel,
    handleFinish,
    deleteGeometry,
    handleResetEditedPointPosition
} : DrawingMessageProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            L.DomEvent.disableClickPropagation(containerRef.current);
            L.DomEvent.disableScrollPropagation(containerRef.current);
        }
    }, []);

    return (
        <div ref={containerRef} className='w-3/4 flex gap-2 justify-between items-center absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/90 px-4 py-2 rounded-lg shadow-md'>
            <div className='flex items-center'>
                { (drawingMode == 'course' || drawingMode == 'area' || drawingMode == 'polylineEquipment') &&
                    <UndoRedoButtons undoStack={undoStack} redoStack={redoStack} handleUndo={handleUndo} handleRedo={handleRedo}/>
                }
                { (drawingMode == 'null') &&
                    <DeleteButton deleteFunction={deleteGeometry}/>
                }
                { drawingMode == 'editPoint' &&
                    <Button variant={'outline'} className='cursor-pointer' onClick={() => { handleResetEditedPointPosition() }}>Rétablir</Button>
                }
            </div>
            <DrawingMessage warning={warning} drawingMode={drawingMode}/>
            <div>
                { (drawingMode == 'area' || drawingMode == 'editPoint') &&
                    <CancelValidButtons handleCancel={handleCancel} handleValidate={handleValidate}/>
                }
                { (drawingMode == 'createPoint') &&
                    <Button className='cursor-pointer' onClick={handleFinish}>Terminé</Button>
                }
            </div>
        </div>
    )
}