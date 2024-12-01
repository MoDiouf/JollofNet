import { Module } from '@nestjs/common';
import { ProfilService } from './profil.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/sign-log/entities/user.entity';
import { ProfilController } from './profil.controller';

@Module({
  controllers:[ProfilController],
  providers: [ProfilService],
  imports:[TypeOrmModule.forFeature([User])]
})
export class ProfilModule {}
