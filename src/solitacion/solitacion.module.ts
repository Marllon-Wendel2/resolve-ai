import { Module } from '@nestjs/common';
import { SolitacionService } from './solitacion.service';
import { SolitacionController } from './solitacion.controller';

@Module({
  controllers: [SolitacionController],
  providers: [SolitacionService],
})
export class SolitacionModule {}
