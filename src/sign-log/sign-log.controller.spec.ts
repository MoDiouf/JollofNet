import { Test, TestingModule } from '@nestjs/testing';
import { SignLogController } from './sign-log.controller';

describe('SignLogController', () => {
  let controller: SignLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignLogController],
    }).compile();

    controller = module.get<SignLogController>(SignLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
