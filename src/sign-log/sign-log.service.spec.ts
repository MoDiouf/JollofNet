import { Test, TestingModule } from '@nestjs/testing';
import { SignLogService } from './sign-log.service';

describe('SignLogService', () => {
  let service: SignLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignLogService],
    }).compile();

    service = module.get<SignLogService>(SignLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
