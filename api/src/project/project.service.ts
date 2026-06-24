import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    try {
      return this.prisma.project.create({
        data: {
          name: dto.name,
          startAtDate: dto.startAtDate,
          endAtDate: dto.endAtDate,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Impossible de créer le projet');
    }
  }

  async findAll() {
    try {
      return this.prisma.project.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (_) {
      throw new InternalServerErrorException('Impossible de récupérer les projets');
    }
  }

  async findOne(id: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: {
          id,
        }
      });
      
      if (!project) {
        throw new NotFoundException('Projet non trouvé');
      }
      
      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Impossible de récupérer le projet');
    }
  }

  async update(id: string, dto: UpdateProjectDto) {
    try {
      await this.prisma.project.update({
        where: {
          id,
        },
        data: {
          name: dto.name,
          endAtDate: dto.endAtDate,
          startAtDate: dto.startAtDate
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Projet non trouvé');
      }
      throw new InternalServerErrorException('Impossible de mettre à jour le projet');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.project.delete({
        where: {
          id,
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Projet non trouvé');
      }
      throw new InternalServerErrorException('Impossible de supprimer le projet');
    }
  }
}
