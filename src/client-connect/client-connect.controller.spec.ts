import { Test, TestingModule } from '@nestjs/testing';
import { ClientConnectController } from './client-connect.controller';

describe('ClientConnectController', () => {
  let controller: ClientConnectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientConnectController],
    }).compile();

    controller = module.get<ClientConnectController>(ClientConnectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
