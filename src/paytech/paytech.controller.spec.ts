import { Test, TestingModule } from '@nestjs/testing';
import { PaytechController } from './paytech.controller';

describe('PaytechController', () => {
  let controller: PaytechController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaytechController],
    }).compile();

    controller = module.get<PaytechController>(PaytechController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
