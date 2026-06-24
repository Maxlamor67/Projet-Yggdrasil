import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { CreateLengthDto } from './dto/create-length.dto';
import { UpdateLengthDto } from './dto/update-length.dto';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class LengthService {
  constructor(
      private readonly prisma: PrismaService,
  ) {}

  async create(safetyEquipmentTypeId: string, createLengthDto: CreateLengthDto) {
    try {
      return await this.prisma.safetyEquipmentTypeLength.create({
        data: {
          safetyEquipmentTypeId,
          ...createLengthDto,
        },
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de créer la longueur de l\'équipement de sécurité');
    }
  }

  async update(safetyEquipmentTypeId: string, id: string, updateLengthDto: UpdateLengthDto) {
    try {
      await this.prisma.safetyEquipmentTypeLength.update({
        where: {
          id,
          safetyEquipmentTypeId,
        },
        data: updateLengthDto,
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de mettre à jour la longueur de l\'équipement de sécurité');
    }
  }

  async remove(safetyEquipmentTypeId: string, id: string) {
    try {
      await this.prisma.safetyEquipmentTypeLength.delete({
        where: {
          id,
          safetyEquipmentTypeId,
          safetyEquipmentType: {
            lengths: {
              some: {
                id: {
                  not: id,
                },
              },
            },
          },
        },
      });
    } catch (_) {
      throw new InternalServerErrorException('Une longueur de type d\'équipement de sécurité liée à des équipements de sécurité ne peut pas être supprimée');
    }
  }
}
