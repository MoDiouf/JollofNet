import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { StatistiqueService } from './statistique.service';

@Controller('app/statistics')
export class StatistiqueController {
  constructor(private readonly statistiqueService: StatistiqueService) {}

  @Get()
  @Render('user/dashboard')
  async getAddNetwork(@Req() req: Request) {
    const name = req.session.user.name;
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const id = req.session.user.id
   const getDataStat = await this.statistiqueService.LookUpData(id)
    const chartData = {
      labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      connexion: [46, 100, 82, 20, 79, 58, 54, 91, 77, 87, 65, 76],
      gains: [18311, 11713, 7918, 5055, 20330, 8827, 17408, 19287, 5390, 7885, 12761, 6545]
    };
    
    console.log(chartData);
    
    return { 
      title: 'Statistiques',
      content: 'statistics',
      name: capitalizedName,
      chartData
    };
  }
}
