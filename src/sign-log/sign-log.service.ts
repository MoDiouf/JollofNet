import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModemInfo } from '../add-network/entities/modemInfo.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignLogService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ModemInfo)
    private modemInfoRepository: Repository<ModemInfo>
  ) {}

  async SearchUser(email: string, password: string): Promise<User | null> {
    try {
        const user = await this.userRepository.findOne({ where: { email } });
        
        if (!user) {
            return null; // User not found
        }

        const isMatch = await bcrypt.compare(password, user.mot_de_passe);
        
        if (!isMatch) {
            return null; // Incorrect password
        }

        return user; // Return the user if everything matches
    } catch (error) {
        console.error('Error searching for user:', error);
        return null; // Optionally handle the error as needed
    }
}


async AddUser(name: string, email: string, password: string): Promise<User> {
  try {
    const existingUser = await this.userRepository.findOne({ 
      where: [{ username: name }, { email }] 
    });

    if (existingUser) {
      const user = await this.SearchUser(name,password)
      return user
      //throw new Error('email ou nom d\'utilisateur existe déjà');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      username: name,
      email: email,
      mot_de_passe: hashedPassword,
    });

    await this.userRepository.save(newUser);

    const modemInfo = this.modemInfoRepository.create({
      utilisateur_id: newUser.id,
      gains: 0,
      modem_username: '',
      modem_mot_de_passe: ''
    });

    await this.modemInfoRepository.save(modemInfo);

    return newUser; // Retourner l'utilisateur nouvellement créé

  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
    throw error;
  }
}

}
