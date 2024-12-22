import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserConnected } from './entities/userConnected.entity';
import { MoreThanOrEqual, LessThan } from 'typeorm';
@Injectable()
export class StatistiqueService {
  constructor(
    @InjectRepository(UserConnected)
    private userConnectedRepository: Repository<UserConnected>,

  ) {}

  async lookUpData(id: number) {
    const now = new Date();


    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const startOfMonthISO = startOfMonth.toISOString().split('T')[0]; 
    const startOfNextMonthISO = startOfNextMonth.toISOString().split('T')[0];

    const connectedUser = await this.userConnectedRepository.find({
        where: {
            id: id,
            month_year: MoreThanOrEqual(startOfMonthISO) && LessThan(startOfNextMonthISO),
        },
    });

    return connectedUser;
}


  async updateMonthlyStats() {

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);

    // Simulation d'une logique
    await this.userConnectedRepository.update(
      { id: 1 }, // Par exemple ici pour id
      { month_year: nextMonth.toISOString().slice(0, 10) }, // Date mise à jour
    );

    console.log('Statistiques mises à jour pour le mois suivant');
  }
  @Cron('0 0 1 * *') // Chaque premier jour du mois à minuit
  async handleMonthlyUpdate() {
    await this.updateMonthlyStats();
  }
}
