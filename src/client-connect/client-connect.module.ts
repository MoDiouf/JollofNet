import { Module,  } from '@nestjs/common';
import { ClientConnectController } from './client-connect.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseauInfo } from 'src/add-network/entities/reseaux.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,  // Ajoutez HttpModule ici
    TypeOrmModule.forFeature([ReseauInfo])
  ],
  controllers: [ClientConnectController],
})
export class ClientConnectModule {}
