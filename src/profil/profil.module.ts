import { Module } from '@nestjs/common';
import { ProfilService } from './profil.service';

@Module({
  providers: [ProfilService]
})
export class ProfilModule {}
