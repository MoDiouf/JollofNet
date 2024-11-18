import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddNetworkService } from './add-network.service';
import { AddNetworkController } from './add-network.controller';
import { ModemInfo } from './entities/modemInfo.entity';
import { SharedModule } from 'src/shared/shared.module';
import { SharedService } from 'src/shared/shared.service';
import { ReseauInfo } from './entities/reseaux.entity';



@Module({
  imports: [TypeOrmModule.forFeature([ModemInfo,ReseauInfo]),SharedModule],
  controllers: [AddNetworkController],
  providers: [AddNetworkService,SharedService ],
  exports: [TypeOrmModule],
})
export class AddNetworkModule {}
