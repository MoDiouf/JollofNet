import { Controller, Get, Render } from '@nestjs/common';

@Controller('profil')
export class ProfilController {
    @Get()
    @Render('user/dashboard')
    getAddNetwork() {
      return { title: 'Profil', content: 'profil' };
    }
}
