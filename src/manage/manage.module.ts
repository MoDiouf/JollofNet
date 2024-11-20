import { Module } from '@nestjs/common';
import { ManageController } from './manage.controller';
import { ManageService } from './manage.service';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseauInfo } from 'src/add-network/entities/reseaux.entity';
import { AddNetworkService } from 'src/add-network/add-network.service';
import { ModemInfo } from 'src/add-network/entities/modemInfo.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ReseauInfo,ModemInfo]),SharedModule], 
  controllers: [ManageController],
  providers: [ManageService,AddNetworkService] 
})
export class ManageModule {}
