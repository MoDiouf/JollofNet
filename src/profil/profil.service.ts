import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/sign-log/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilService {
constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
){

}
    async getUserData(id :number){
        return await this.userRepository.findOne({ 
            where:{id: id}
        })
        
    }
    async updateUser(idUser: number, body: any) {
        const user = await this.userRepository.findOne({ where: { id: idUser } });
      
        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }
        if (body.username) {
          user.username = body.username;
        }
      
        if (body.email) {
          user.email = body.email;
        }
      
        if (body.prenom) {
          user.prenom = body.prenom;
        }
      
        if (body.nom) {
          user.nom = body.nom;
        }
      
        if (body.numero_de_tel) {
          user.numero_de_tel = body.numero_de_tel;
        }
        await this.userRepository.save(user);
      
        return true;
      }
      
    }

