import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateAttentionPointDto } from './dto/create-attention-point.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {PointType, Prisma} from "@prisma/client";

@Injectable()
export class AttentionPointService {
  constructor(private prisma: PrismaService) {}

  async create(projectId: string, dto: CreateAttentionPointDto) {
    try {
      return await this.prisma.attentionPoint.create({
        data: {
          project: {
            connect: {
              id: projectId,
            }
          },
          ...dto,
          point: {
            create: {
              type: PointType.ATTENTION_POINT,
              ...dto.point,
            }
          },
        }
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de créer le point d\'attention');
    }
  }

  async remove(projectId: string, id: string) {
    try {
      await this.prisma.point.deleteMany({
        where: {
          attentionPoint: {
            id,
            projectId,
          },
        },
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de supprimer le point d\'attention');
    }
  }

  async findAll(projectId: string) {
    try {
      return this.prisma.attentionPoint.findMany({
        where: {
          projectId
        },
        include: {
          point: true,
        },
        orderBy: {
          createdAt: 'asc'
        },
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de récupérer les points d\'attention');
    }
  }

  async findOne(projectId: string, id: string) {
    try {
      return await this.prisma.attentionPoint.findUniqueOrThrow({
        where: {
          projectId,
          id,
        },
        include: {
          point: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Point d\'attention non trouvé');
      }
      throw new InternalServerErrorException('Impossible de récupérer le point d\'attention');
    }
  }
}
