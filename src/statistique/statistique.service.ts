import { Injectable } from '@nestjs/common';
import { UserConnected } from './entities/connected.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StatistiqueService {
    constructor(
        @InjectRepository(UserConnected)
        private userConnectedRepository: Repository<UserConnected>,
    ){}
    async lookUpData(id:number){

    }
}
