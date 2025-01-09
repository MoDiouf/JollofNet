import * as session from 'express-session';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SignLogModule } from './sign-log/sign-log.module';
import { User } from './sign-log/entities/user.entity';
import { ModemInfo } from './add-network/entities/modemInfo.entity';
import { AddNetworkService } from './add-network/add-network.service';
import { AddNetworkController } from './add-network/add-network.controller';
import { AddNetworkModule } from './add-network/add-network.module';
import { ManageModule } from './manage/manage.module';
import { StatistiqueService } from './statistique/statistique.service';
import { ProfilController } from './profil/profil.controller';
import { ProfilModule } from './profil/profil.module';
import { SharedService } from './shared/shared.service';
import { ManageService } from './manage/manage.service';
import { ProfilService } from './profil/profil.service';
import { ManageController } from './manage/manage.controller';
import { SharedModule } from './shared/shared.module';
import { ReseauInfo } from './add-network/entities/reseaux.entity';
import { AuthGoogleController } from './auth-google/auth-google.controller';
import { AuthModule } from './auth-google/auth-google.module';
import { UserConnected } from './statistique/entities/userConnected.entity';
import { StatistiqueModule } from './statistique/statistique.module';
import { StatistiqueController } from './statistique/statistique.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientConnectController } from './client-connect/client-connect.controller';
import { ClientConnectModule } from './client-connect/client-connect.module';

import { ConfigModule } from '@nestjs/config';
import { PayDunyaController } from './paydunya/paydunya.controller';
import { PayDunyaService } from './paydunya/paydunya.service';
import { PaydunyaModule } from './paydunya/paydunya.module';
import { HttpModule } from '@nestjs/axios';



@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, // Rendre le module accessible partout dans l'application
      envFilePath: '.env', // Indiquez le chemin vers le fichier .env
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Sword@rtonline',
      database: 'JollofNet',
      entities: [User,ModemInfo,UserConnected,ReseauInfo],
      synchronize: false,
    }),
    SignLogModule,
    AddNetworkModule,
    ManageModule,
    ProfilModule,
    SharedModule,
    AuthModule,
    StatistiqueModule,
    ClientConnectModule,
    PaydunyaModule,
  ],
  controllers: [AppController, AddNetworkController, ProfilController, ManageController, AuthGoogleController, ClientConnectController, PayDunyaController],
  providers: [AppService, AddNetworkService, SharedService, ManageService, ProfilService, PayDunyaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(session({
        secret: 'jollofNetTheme',  // Remplacez par une clé secrète
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }  // Mettez à true si vous utilisez HTTPS
      }))
      .forRoutes('*');  // Applique ce middleware à toutes les routes
  }
}
