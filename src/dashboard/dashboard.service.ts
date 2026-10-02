import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashboardData() {
    const totalSolicitations = await this.prismaService.solitacion.count();
    const openSolicitations = await this.prismaService.solitacion.count({
      where: { status: 'Open' },
    });
    const inProgressSolicitations = await this.prismaService.solitacion.count({
      where: { status: 'InProgress' },
    });
    const closedSolicitations = await this.prismaService.solitacion.count({
      where: { status: 'Closed' },
    });

    return {
      totalSolicitations,
      openSolicitations,
      inProgressSolicitations,
      closedSolicitations,
    };
  }
}
