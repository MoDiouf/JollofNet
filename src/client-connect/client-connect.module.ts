import { Module } from '@nestjs/common';
import { ClientConnectService } from './client-connect.service';

@Module({
  providers: [ClientConnectService]
})
export class ClientConnectModule {}
