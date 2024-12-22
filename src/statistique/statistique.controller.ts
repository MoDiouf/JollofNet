import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { StatistiqueService } from './statistique.service';

@Controller('app/statistics')
export class StatistiqueController {
  constructor(private readonly statistiqueService: StatistiqueService) {}

  @Get()
  @Render('user/dashboard')
  async getStatistics(@Req() req: Request) {
    const name = req.session.user.name;
    const capitalizedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const id = req.session.user.id;

    const stats = await this.statistiqueService.lookUpData(id);

    
    const labels = stats.map((entry) => entry.month_year); 
    const connexion = stats.map((entry) => entry.number_connected);
    const gains = stats.map((entry) => entry.gain);
    const lastGain = gains[gains.length - 1];

    const chartData = {
      labels,
      connexion,
      gains,
      lastGain
    };

    return {
      title: 'Statistiques',
      content: 'statistics',
      name: capitalizedName,
      chartData,
    };
  }
}
