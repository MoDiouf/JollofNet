import { Module,  } from '@nestjs/common';
import { ClientConnectController } from './client-connect.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseauInfo } from 'src/add-network/entities/reseaux.entity';
import { HttpModule } from '@nestjs/axios';
import { ClientConnectService } from './client-connect.service';

import { UserConnected } from 'src/statistique/entities/userConnected.entity';

@Module({
  imports: [
    HttpModule,  // Ajoutez HttpModule ici
    TypeOrmModule.forFeature([ReseauInfo,UserConnected])
  ],
  controllers: [ClientConnectController],
  providers: [ClientConnectService],
  exports: [ClientConnectService],
})
export class ClientConnectModule {}
