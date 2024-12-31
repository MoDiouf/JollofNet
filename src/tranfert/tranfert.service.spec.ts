import { Test, TestingModule } from '@nestjs/testing';
import { TranfertService } from './tranfert.service';

describe('TranfertService', () => {
  let service: TranfertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranfertService],
    }).compile();

    service = module.get<TranfertService>(TranfertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
