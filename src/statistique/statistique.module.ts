import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatistiqueController } from './statistique.controller';
import { StatistiqueService } from './statistique.service';
import { UserConnected } from './entities/connected.entity';


@Module({
  imports: [TypeOrmModule.forFeature([UserConnected])],
  controllers: [StatistiqueController],
  providers: [StatistiqueService],

})
export class StatistiqueModule {}
