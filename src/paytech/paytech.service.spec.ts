import { Test, TestingModule } from '@nestjs/testing';
import { PaytechService } from './paytech.service';

describe('PaytechService', () => {
  let service: PaytechService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaytechService],
    }).compile();

    service = module.get<PaytechService>(PaytechService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
