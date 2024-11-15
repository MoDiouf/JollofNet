import { Module } from '@nestjs/common';
import { SignLogController } from './sign-log.controller';
import { SignLogService } from './sign-log.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModemInfo } from '../add-network/entities/modemInfo.entity';
import { SharedService } from 'src/shared/shared.service';
import { SharedModule } from 'src/shared/shared.module';


@Module({
  controllers: [SignLogController],
  imports:[TypeOrmModule.forFeature([User,ModemInfo]),SharedModule],
  providers: [SignLogService,SharedService ]
})
export class SignLogModule {}
