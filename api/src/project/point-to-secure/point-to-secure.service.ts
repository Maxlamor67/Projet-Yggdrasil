import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePointToSecureDto } from './dto/create-point-to-secure.dto';
import { UpdatePointToSecureDto } from './dto/update-point-to-secure.dto';
import { FilterPointToSecureDto } from './dto/filter-point-to-secure.dto';
import {PointType, Prisma} from "@prisma/client";

@Injectable()
export class PointToSecureService {
  constructor(private prisma: PrismaService) {}

  async create(projectId: string, data: Omit<CreatePointToSecureDto, 'photos'>) {
    try {
      return this.prisma.pointToSecure.create({
        data: {
          project: {
            connect: {
              id: projectId,
            },
          },
          ...(data.safetyEquipmentTypeId
                  ? { safetyEquipmentType: { connect: { id: data.safetyEquipmentTypeId } } }
                  : {}),
          isTreated: data.isTreated,
          comment: data.comment,
          point: {
            create: {
              type: PointType.POINT_TO_SECURE,
              ...data.point,
            },
          },
        }
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de créer le point d\'intérêt');
    }
  }

  async remove(projectId: string, id: string) {
    try {
      await this.prisma.point.deleteMany({
        where: {
          pointToSecure: {
            projectId,
            id
          },
        },
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de supprimer le point d\'intérêt');
    }
  }

  async findAll(projectId: string, filters: FilterPointToSecureDto) {
    try {
      return this.prisma.pointToSecure.findMany({
        where: {
          projectId,
        },
        include: {
          point: true,
        }
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de récupérer les points d\'intérêt');
    }
  }

  async findOne(projectId: string, id: string) {
    try {
      const pointToSecure = await this.prisma.pointToSecure.findUnique({
        where: {
          projectId,
          id,
        },
        include: {
          point: true,
          safetyEquipmentType: true,
          photos: {
            select: {
              id: true,
            }
          },
        }
      });
      
      if (!pointToSecure) {
        throw new NotFoundException('Point d\'intérêt non trouvé');
      }
      
      return pointToSecure;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Impossible de récupérer le point d\'intérêt');
    }
  }

  async update(projectId: string, id: string, data: UpdatePointToSecureDto) {
    try {
      await this.prisma.pointToSecure.update({
        where: {
          projectId,
          id,
        },
        data: {
          isTreated: data.isTreated,
          comment: data.comment,
          ...(data.safetyEquipmentTypeId
                  ? { safetyEquipmentType: { connect: { id: data.safetyEquipmentTypeId } } }
                  : {}),
          point: {
            update: {
              ...data.point,
            },
          },
        },
      });
    } catch (_) {
        throw new InternalServerErrorException('Impossible de mettre à jour le point d\'intérêt');
    }
  }

  async findOnePhoto(projectId: string, id: string, photoId: string) {
    try {
      return await this.prisma.photo.findUniqueOrThrow({
        where: {
          id: photoId,
          pointToSecure: {
            projectId,
            id,
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Photo du point d\'intérêt non trouvée');
      }
      throw new InternalServerErrorException('Impossible de récupérer la photo du point d\'intérêt');
    }
  }
}
