import { Test, TestingModule } from '@nestjs/testing';
import { PaydunyaService } from './paydunya.service';

describe('PaydunyaService', () => {
  let service: PaydunyaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaydunyaService],
    }).compile();

    service = module.get<PaydunyaService>(PaydunyaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
