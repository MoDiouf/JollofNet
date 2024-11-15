import { Controller, Get, Render } from '@nestjs/common';

@Controller('statistics')
export class StatistiqueController {
    @Get()
    @Render('user/dashboard')
    getAddNetwork() {
      return { title: 'Statistique', content: 'statistics' };
    }
}
