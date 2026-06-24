import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { CreateSafetyEquipmentTypeDto } from './dto/create-safety-equipment-type.dto';
import { UpdateSafetyEquipmentTypeDto } from './dto/update-safety-equipment-type.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class SafetyEquipmentTypeService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createSafetyEquipmentTypeDto: CreateSafetyEquipmentTypeDto) {
    try {
      return await this.prisma.safetyEquipmentType.create({
        data: {
          ...createSafetyEquipmentTypeDto,
          lengths: {
            createMany: {
              data: createSafetyEquipmentTypeDto.lengths,
            }
          }
        },
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de créer le type d\'équipement de sécurité');
    }
  }

  async findAll() {
    try {
      return await this.prisma.safetyEquipmentType.findMany({
        include: {
          lengths: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de récupérer les types d\'équipements de sécurité');
    }
  }

  async update(id: string, updateSafetyEquipmentTypeDto: UpdateSafetyEquipmentTypeDto) {
    try {
      await this.prisma.safetyEquipmentType.update({
        where: {
          id,
        },
        data: updateSafetyEquipmentTypeDto,
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de mettre à jour le type d\'équipement de sécurité');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.safetyEquipmentType.delete({
        where: {
          id,
        }
      });
    } catch (_) {
      throw new InternalServerErrorException('Un type d\'équipement de sécurité lié à des équipements ne peut pas être supprimé');
    }
  }
}
