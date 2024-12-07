import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from 'src/sign-log/entities/user.entity';
import { SignLogService } from 'src/sign-log/sign-log.service';
import { Repository } from 'typeorm';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly signLog: SignLogService,
  ) {
    super({
      clientID: '1035853730614-ir12e1ik515d41id4k71ncrf4cbof8b4.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth-google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { name, emails } = profile;
      if (!emails || emails.length === 0) {
        return done(new Error('Aucune adresse e-mail trouvée dans le profil Google.'), null);
      }

      const userData = {
        username: name?.givenName || 'defaultUsername',
        email: emails[0].value,
        mot_de_passe: '', // Le mot de passe reste vide, car c'est une authentification via OAuth
      };

      console.log('Données récupérées via Google:', userData);

      // Chercher l'utilisateur existant dans la base avec l'email ou le username
      let existingUser = await this.userRepository.findOne({
        where: [
          { email: userData.email },
          { username: userData.username }
        ]
      });

      if (existingUser) {
        console.log('Utilisateur déjà existant:', existingUser);
        return done(null, existingUser);
      }

      const user = await this.signLog.AddUser(userData.username, userData.email, userData.mot_de_passe);

      return done(null, user);
    } catch (error) {
      console.error('Erreur dans la stratégie Google:', error);
      return done(error, null);
    }
  }
}
