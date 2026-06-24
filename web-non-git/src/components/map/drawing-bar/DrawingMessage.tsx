import {CircleAlert, Fence, MapPin, SquareDashedMousePointer, Waypoints, Car} from "lucide-react";

interface DrawingMessageProps {
    warning: string | null;
    drawingMode: string | null;
}

export default function DrawingMessage({ warning, drawingMode } : DrawingMessageProps) {
    const getModeLabel = () => {
        switch (drawingMode) {
            case 'course': return 'Parcours';
            case 'area': return 'Zone';
            case 'createPoint': return 'Point (création)';
            case 'editPoint': return 'Point (édition)';
            case 'polylineEquipment': return 'Obstacle';
            case 'vehicleEquipment': return 'Véhicule';
            case 'attentionPoint': return 'Point d\'attention';
            default: return drawingMode;
        }
    };

    return (
        <div className="flex flex-col items-center">
            {
                warning ?
                    <div className='flex gap-2 items-center text-yellow-500'>
                        <CircleAlert/>
                        <p className="text-sm ">{warning}</p>
                    </div>
                    :
                    <div className='flex gap-2 items-center'>
                        { drawingMode == 'course' && <Waypoints size={20} />}
                        { drawingMode == 'area' && <SquareDashedMousePointer />}
                        { (drawingMode == 'createPoint' || drawingMode == 'editPoint') && <MapPin />}
                        { drawingMode == 'polylineEquipment' && <Fence />}
                        { drawingMode == 'vehicleEquipment' && <Car />}
                        { drawingMode == 'attentionPoint' && <CircleAlert />}
                        <p className="text-sm">Mode {getModeLabel()}</p>
                    </div>
            }
        </div>
    )
}