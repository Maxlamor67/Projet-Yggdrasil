import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {UpdateActionDto} from './dto/update-action.dto';
import {PrismaService} from "../../../prisma/prisma.service";
import {Prisma} from "@prisma/client";

@Injectable()
export class ActionService {
  constructor(private prisma: PrismaService) {}

  async update(projectId: string, safetyEquipmentId: string, id: string, dto: UpdateActionDto) {
    try {
      const updateAction: Prisma.ActionUpdateArgs = {
        where: {
          id,
          safetyEquipment: {
            id: safetyEquipmentId,
            projectId,
          }
        },
        data: {},
      };

      if (dto.teamId) {
        updateAction.data.team = {
          connect: {
            id: dto.teamId,
          },
        };
      } else {
        updateAction.data.team = {
          disconnect: true,
        };
      }

      await this.prisma.action.update(updateAction);
    } catch (_) {
      throw new InternalServerErrorException('Impossible de modifier l\'action');
    }
  }
}
