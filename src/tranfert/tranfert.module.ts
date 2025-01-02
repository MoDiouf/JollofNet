import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Import du HttpModule
import { TransfertService } from './tranfert.service';
import { TransferController } from './tranfert.controller';

@Module({
  imports: [HttpModule], // Ajoutez HttpModule ici
  controllers: [TransferController],
  providers: [TransfertService],
})
export class TransferModule {}
