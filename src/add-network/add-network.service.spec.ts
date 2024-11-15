import { Test, TestingModule } from '@nestjs/testing';
import { AddNetworkService } from './add-network.service';

describe('AddNetworkService', () => {
  let service: AddNetworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddNetworkService],
    }).compile();

    service = module.get<AddNetworkService>(AddNetworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
