import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SolitacionModule } from './solitacion/solitacion.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, SolitacionModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
