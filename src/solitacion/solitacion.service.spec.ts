import { Test, TestingModule } from '@nestjs/testing';
import { SolitacionService } from './solitacion.service';

describe('SolitacionService', () => {
  let service: SolitacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolitacionService],
    }).compile();

    service = module.get<SolitacionService>(SolitacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
