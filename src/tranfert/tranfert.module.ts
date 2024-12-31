import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';  // Importer le module HttpModule
import { TransfertService } from './tranfert.service';
import { TransferController } from './tranfert.controller';


@Module({
  imports: [HttpModule],  // Ajouter HttpModule ici
  providers: [TransfertService],
  controllers: [TransferController],
})
export class TransferModule {}
