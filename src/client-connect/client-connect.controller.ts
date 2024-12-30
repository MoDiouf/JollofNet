import { Body, Controller, Get, Param, Post, Query, Render, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { ReseauInfo } from 'src/add-network/entities/reseaux.entity';
import { Repository } from 'typeorm';
import { ClientConnectService } from './client-connect.service';

@Controller('client-connect')
export class ClientConnectController {
  constructor(
    @InjectRepository(ReseauInfo)
    private ReseauInfoRepository: Repository<ReseauInfo>,
    //private readonly clientService: ClientConnectService
  ) {}

  @Get(':uuid')
  async redirectToNetwork(@Param('uuid') uuid: string, @Query() query: any,@Res() res:Response) {
    // Recherche du réseau correspondant à l'UUID
    console.log("link",uuid);
    
    const reseau = await this.ReseauInfoRepository.findOne({
      where: { link: uuid },
    });

    if (!reseau) {
      throw new Error('Réseau non trouvé');
    }

    // Extraire les informations du réseau
    const {  modem_id, essid } = reseau;
    console.log("id_User",modem_id);
    console.log("Nom reseau",essid);
    
    // Passer ces informations à la vue EJS
    return res.render("clientPage/client",{
      
      modem_id,
      essid,
      
    });
  }
  @Post()
  @Post()
  async handleClientForm(@Body() body: any, @Res() res: Response) {
    const { modem_id, essid, mac1, mac2, mac3, mac4, mac5, mac6, nom } = body;

    // Concaténer les parties de l'adresse MAC
    const macAddress = [mac1, mac2, mac3, mac4, mac5, mac6].join(':');

    // Affiche les informations pour la vérification
    console.log("Nom:", nom);
    console.log("Modem ID:", modem_id);
    console.log("ESSID:", essid);
    console.log("Adresse MAC:", macAddress);

    // Traitement de la logique métier (par exemple, stockage dans la base de données)
    // ...

    // Réponse à l'utilisateur
    return res.status(200).send('Données reçues avec succès');
  }

}
