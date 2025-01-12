import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModemInfo } from 'src/add-network/entities/modemInfo.entity';
import { UserConnected } from 'src/statistique/entities/userConnected.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientConnectService {
    constructor(
        @InjectRepository(UserConnected)
    private ModemInfoRepository: Repository<UserConnected>
    ){

    }
   async addClient(userModem:string,passModem:string,macAddress:string,nom:string){

    }
    async updateGain(idUser:number,gain:number){
        const gainUp = await this.ModemInfoRepository.findOne({where:{id:idUser}})
        if (!gainUp) {
            console.log("Utilisateur non trouvé");
            return
        }
        // Calculer le nouveau gain et incrémenter le nombre de connexions
        const newGain = gainUp.gain + gain;
        const newNumberConnected = gainUp.number_connected + 1;

        // Mettre à jour les champs nécessaires
        gainUp.gain = newGain;
        gainUp.number_connected = newNumberConnected;

        // Sauvegarder les modifications
        await this.ModemInfoRepository.save(gainUp);

    console.log(`Gain et nombre de connexions mis à jour pour l'utilisateur ${idUser}: Nouveau gain = ${newGain}, Nombre de connexions = ${newNumberConnected}`);
    }
    async addListClient(nom:string,macAddress:string){

    }
}
