import { Module } from '@nestjs/common';
import { PayDunyaService } from './paydunya.service';
import { PayDunyaController } from './paydunya.controller';

@Module({
  providers: [PayDunyaService],
  controllers: [PayDunyaController],
})
export class PaydunyaModule {}
