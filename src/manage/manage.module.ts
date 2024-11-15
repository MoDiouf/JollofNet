import { Module } from '@nestjs/common';
import { ManageController } from './manage.controller';
import { ManageService } from './manage.service';
import { SharedModule } from 'src/shared/shared.module';


@Module({
  imports: [SharedModule], 
  controllers: [ManageController],
  providers: [ManageService] 
})
export class ManageModule {}
