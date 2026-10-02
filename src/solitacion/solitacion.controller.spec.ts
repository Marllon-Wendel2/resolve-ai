import { Test, TestingModule } from '@nestjs/testing';
import { SolitacionController } from './solitacion.controller';
import { SolitacionService } from './solitacion.service';

describe('SolitacionController', () => {
  let controller: SolitacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolitacionController],
      providers: [SolitacionService],
    }).compile();

    controller = module.get<SolitacionController>(SolitacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
