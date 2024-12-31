import { Test, TestingModule } from '@nestjs/testing';
import { PaydunyaController } from './paydunya.controller';

describe('PaydunyaController', () => {
  let controller: PaydunyaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaydunyaController],
    }).compile();

    controller = module.get<PaydunyaController>(PaydunyaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
