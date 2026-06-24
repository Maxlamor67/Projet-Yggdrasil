import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateSafetyEquipmentDto } from './dto/create-safety-equipment.dto';
import { UpdateSafetyEquipmentDto } from './dto/update-safety-equipment.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {PointType, Prisma, SafetyEquipmentTypeModel} from "@prisma/client";
import {CreateRankedPointDto} from "../../utils/dto/create-point.dto";

@Injectable()
export class SafetyEquipmentService {
  constructor(private prisma: PrismaService) {}

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3;
    const phi1 = lat1 * Math.PI/180;
    const phi2 = lat2 * Math.PI/180;
    const deltaPhi = (lat2-lat1) * Math.PI/180;
    const deltaLambda = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  private getSafetyEquipmentNumber(points: CreateRankedPointDto[], safetyEquipmentTypeLength: number) {
    let totalLength = 0;
    const sortedPoints = points.sort((a, b) => a.rank - b.rank);
    for (let i = 1; i < sortedPoints.length; i++) {
      totalLength += this.haversineDistance(
          sortedPoints[i - 1].latitude,
          sortedPoints[i - 1].longitude,
          sortedPoints[i].latitude,
          sortedPoints[i].longitude,
      );
    }
    return Math.floor(totalLength / safetyEquipmentTypeLength);
  }

  async create(projectId: string, data: CreateSafetyEquipmentDto) {
    try {
      const createSafetyEquipment: Prisma.SafetyEquipmentCreateArgs = {
        data: {
          project: {
            connect: {
              id: projectId,
            },
          },
          safetyEquipmentTypeLength: {
            connect: {
              id: data.safetyEquipmentTypeLengthId,
            },
          },
          actions: {
            createMany: {
              data: [
                {
                  type: 'SET',
                  realizedAt: data.setAt,
                  teamId: data.setTeamId,
                },
                {
                  type: 'UNSET',
                  realizedAt: data.unsetAt,
                  teamId: data.unsetTeamId,
                }
              ]
            },
          },
          safetyEquipmentTypeLengthCount: 1,
        },
      };

      const safetyEquipmentTypeLength = await this.prisma.safetyEquipmentTypeLength.findUniqueOrThrow({
        where: {
          id: data.safetyEquipmentTypeLengthId,
        },
        include: {
          safetyEquipmentType: true,
        }
      });
      if (safetyEquipmentTypeLength.safetyEquipmentType.model === SafetyEquipmentTypeModel.OBSTACLE) {
        const safetyEquipmentTypeLengthCount = this.getSafetyEquipmentNumber(data.points, safetyEquipmentTypeLength.length);
        if (safetyEquipmentTypeLengthCount > 0) {
          createSafetyEquipment.data.safetyEquipmentTypeLengthCount = safetyEquipmentTypeLengthCount;
        }
      }

      return await this.prisma.$transaction(async (tx) => {
        const safetyEquipment = await tx.safetyEquipment.create(createSafetyEquipment);
        const createManyPoints = data.points.map((point) => (
          tx.point.create({
            data: {
              latitude: point.latitude,
              longitude: point.longitude,
              type: PointType.SAFETY_EQUIPMENT,
              safetyEquipmentPoint: {
                create: {
                  rank: point.rank,
                  safetyEquipmentId: safetyEquipment.id,
                },
              },
            },
          })
        ));
        await Promise.all(createManyPoints);

        return safetyEquipment;
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de créer l\'équipement de sécurité');
    }
  }

  async remove(projectId: string, id: string) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.point.deleteMany({
          where: {
            safetyEquipmentPoint: {
              safetyEquipmentId: id,
            },
          },
        });
        await tx.safetyEquipment.delete({
          where: {
            projectId,
            id,
          },
        });
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de supprimer l\'équipement de sécurité');
    }
  }

  async findAll(projectId: string) {
    try {
      return this.prisma.safetyEquipment.findMany({
        where: {
          projectId,
        },
        include: {
          safetyEquipmentPoints: {
            include: {
              point: true,
            },
          },
          safetyEquipmentTypeLength: {
            include: {
              safetyEquipmentType: true,
            },
          },
          actions: {
            include: {
              team: true,
            }
          }
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de récupérer les équipements de sécurité');
    }
  }

  async findOne(projectId: string, id: string) {
    try {
      const safetyEquipment = await this.prisma.safetyEquipment.findUnique({
        where: {
          projectId,
          id,
        },
        include: {
          safetyEquipmentPoints: {
            include: {
              point: true,
            },
          },
          safetyEquipmentTypeLength: {
            include: {
              safetyEquipmentType: true,
            },
          },
          actions: true,
        },
      });
      
      if (!safetyEquipment) {
        throw new NotFoundException('Équipement de sécurité non trouvé');
      }
      
      return safetyEquipment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Impossible de récupérer l\'équipement de sécurité');
    }
  }

  async update(projectId: string, id: string, data: UpdateSafetyEquipmentDto) {
    try {
      const updateSafetyEquipment: Prisma.SafetyEquipmentUpdateArgs = {
        where: { id, projectId},
        data: {
          safetyEquipmentTypeLengthCount: data.items,
          actions: {
            update: [
              {
                where: {
                  safetyEquipmentId_type: {
                    safetyEquipmentId: id,
                    type: 'SET',
                  },
                },
                data: {
                  realizedAt: data.setAt,
                  teamId: data.setTeamId,
                },
              },
              {
                where: {
                  safetyEquipmentId_type: {
                    safetyEquipmentId: id,
                    type: 'UNSET',
                  },
                },
                data: {
                  realizedAt: data.unsetAt,
                  teamId: data.unsetTeamId,
                },
              },
            ],
          },
        },
      };

      await this.prisma.$transaction(async (tx) => {
        await tx.safetyEquipment.update(updateSafetyEquipment);

        if (data.points && data.points.length > 0) {
          await tx.point.deleteMany({
            where: {
              safetyEquipmentPoint: { safetyEquipmentId: id },
            },
          });

          await Promise.all(
            data.points.map((p) =>
              tx.point.create({
                data: {
                  latitude: p.latitude,
                  longitude: p.longitude,
                  type: PointType.SAFETY_EQUIPMENT,
                  safetyEquipmentPoint: {
                    create: { rank: p.rank, safetyEquipmentId: id },
                  },
                },
              }),
            ),
          );
        }
      });
    } catch (_) {
      throw new InternalServerErrorException("Impossible de mettre à jour l'équipement de sécurité");
    }
  }
}
