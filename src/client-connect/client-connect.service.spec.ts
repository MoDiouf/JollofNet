import { Test, TestingModule } from '@nestjs/testing';
import { ClientConnectService } from './client-connect.service';

describe('ClientConnectService', () => {
  let service: ClientConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientConnectService],
    }).compile();

    service = module.get<ClientConnectService>(ClientConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
