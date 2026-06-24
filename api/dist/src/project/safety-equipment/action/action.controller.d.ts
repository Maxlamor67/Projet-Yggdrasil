import { ActionService } from './action.service';
import { UpdateActionDto } from './dto/update-action.dto';
export declare class ActionController {
    private readonly actionService;
    constructor(actionService: ActionService);
    update(projectId: string, safetyEquipmentId: string, id: string, updateActionDto: UpdateActionDto): Promise<void>;
}
