import { Injectable } from '@nestjs/common';
import {
  type CreateSolitacionDto,
  type UpdateSolitacionDto,
} from './dto/solitacion.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';
import type { Category, Prisma, Status } from 'src/generated/prisma/client';
import { Filter } from './dto/filter';

interface FindOptions {
  limit: number;
  offset: number;
  orderBy: 'asc' | 'desc';
  filter: Filter;
}

@Injectable()
export class SolitacionService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSolitacion(
    userId: string,
    createSolitacionDto: CreateSolitacionDto,
  ) {
    try {
      return await this.prismaService.solitacion.create({
        data: {
          userId,
          title: createSolitacionDto.title,
          description:
            createSolitacionDto.description ?? 'Descrição não fornecida',
          category: createSolitacionDto.category,
          status: 'Open',
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findLastSolitacion({ limit, offset, orderBy, filter }: FindOptions) {
    try {
      const where: Prisma.SolitacionWhereInput = {};

      if (filter.category) {
        where.category = filter.category as Category;
      }

      if (filter.status) {
        where.status = filter.status as Status;
      }

      if (filter.startDate || filter.endDate) {
        where.createdAt = {
          ...(filter.startDate && { gte: filter.startDate }),
          ...(filter.endDate && { lte: filter.endDate }),
        };
      }

      if (filter.search) {
        where.title = {
          contains: filter.search,
          mode: 'insensitive',
        };
      }

      return await this.prismaService.solitacion.findMany({
        where,
        orderBy: {
          createdAt: orderBy,
        },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async consultSolitacion(id: string) {
    try {
      return await this.prismaService.solitacion.findUnique({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateSolitacion(
    id: string,
    userId: string,
    updateSolitacionDto: UpdateSolitacionDto,
  ) {
    try {
      return await this.prismaService.solitacion.update({
        where: { id, userId },
        data: { ...updateSolitacionDto },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async removeSolitacion(id: string) {
    try {
      return await this.prismaService.solitacion.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
