import { Test, TestingModule } from '@nestjs/testing';
import { TranfertController } from './tranfert.controller';

describe('TranfertController', () => {
  let controller: TranfertController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranfertController],
    }).compile();

    controller = module.get<TranfertController>(TranfertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
