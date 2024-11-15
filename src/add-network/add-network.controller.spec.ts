import { Test, TestingModule } from '@nestjs/testing';
import { AddNetworkController } from './add-network.controller';

describe('AddNetworkController', () => {
  let controller: AddNetworkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddNetworkController],
    }).compile();

    controller = module.get<AddNetworkController>(AddNetworkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
