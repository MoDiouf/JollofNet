import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { StatistiqueService } from './statistique.service';

@Controller('app/statistics')
export class StatistiqueController {
  constructor(private readonly statistiqueService: StatistiqueService) {}
    @Get()
    @Render('user/dashboard')
    getAddNetwork(@Req() req: Request) {
      const name = req.session.user.name;
    const capitalizedname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

      return { 
        title: 'Statistique',
         content: 'statistics',
         name: capitalizedname,
        };
    }
}
