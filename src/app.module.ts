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
import { StatistiqueModule } from './statistique/statistique.module';
import { ProfilController } from './profil/profil.controller';
import { ProfilModule } from './profil/profil.module';
import { SharedService } from './shared/shared.service';
import { ManageService } from './manage/manage.service';
import { ProfilService } from './profil/profil.service';
import { ManageController } from './manage/manage.controller';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'ameth',
      password: '',
      database: 'JollofNet',
      entities: [User, ModemInfo],
      synchronize: false,
    }),
    SignLogModule,
    AddNetworkModule,
    ManageModule,
    StatistiqueModule,
    ProfilModule,
    SharedModule,
  ],
  controllers: [AppController, AddNetworkController, ProfilController, ManageController],
  providers: [AppService, AddNetworkService, StatistiqueService, SharedService, ManageService, ProfilService],
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
