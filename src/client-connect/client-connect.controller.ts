import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReseauInfo } from 'src/add-network/entities/reseaux.entity';
import { ClientConnectService } from './client-connect.service';

@Controller('client-connect')
export class ClientConnectController {
  constructor(
    private readonly ClientService: ClientConnectService,
    private readonly httpService: HttpService,
    @InjectRepository(ReseauInfo)
    private ReseauInfoRepository: Repository<ReseauInfo>
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
  async handleClientForm(@Body() body: any, @Res() res: Response,@Req() req: Request) {
    const { modem_id, essid, mac1, mac2, mac3, mac4, mac5, mac6, nom } = body;
    const userModem = req.session.user.modemUsername
    const passModem = req.session.user.modemPassword
    const reseau = await this.ReseauInfoRepository.findOne({
      where: { essid: essid,modem_id:modem_id },
    });
    // Concaténer les parties de l'adresse MAC
    const macAddress = [mac1, mac2, mac3, mac4, mac5, mac6].join(':');

    // Affiche les informations pour la vérification
    console.log("Nom:", nom);
    console.log("Modem ID:", modem_id);
    console.log("ESSID:", essid);
    console.log("Adresse MAC:", macAddress);

    if (reseau.payant) {
      const invoiceData = {
      invoice: {
        total_amount: reseau.prix_unitaire,
        description: "Wifi pour tous",
      },
      store: {
        name: "JollofNet",
        tagline: "Votre wifi c'est votre",
        phone_number: "+221772843441",
        postal_address: "Dakar Plateau - Etablissement kheweul",
        website_url: "http://www.chez-sandra.sn",
        logo_url: "http://www.chez-sandra.sn/logo.png",
      },
    };

    try {
      // Effectuer un appel POST vers le service PayDunya
      const paymentUrl = await this.createInvoice(invoiceData);
      console.log(paymentUrl);
      
      // Réponse avec l'URL de paiement
      return res.redirect(paymentUrl);
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      return res.status(500).send('Erreur lors de la création de la facture');
    }
    }else{
      const addClient = await this.ClientService.addClient(userModem,passModem,macAddress);
    }
    // Données de la facture à envoyer
    
  }

  @Post('ipn')
  async handleIPN(@Body() body: any, @Res() res: Response) {
    console.log('IPN reçu:', body);

    // Vérifiez la signature ou les données reçues si nécessaire
    const { status, transaction_id, amount } = body;

    if (status === 'completed') {
      console.log(`Paiement réussi pour la transaction ${transaction_id}. Montant : ${amount}`);
      
      // TODO: Effectuez les actions nécessaires (mise à jour de la base de données, etc.)
    } else {
      console.log(`Paiement échoué ou en attente pour la transaction ${transaction_id}`);
    }

    // Répondez avec un code 200 pour confirmer que l'IPN a été traité
    return res.status(200).send('IPN reçu');
  }
  // Méthode pour envoyer la requête POST à PayDunya
  private async createInvoice(invoiceData: any): Promise<string> {
    try {
      const response = await lastValueFrom(
        this.httpService.post('http://localhost:3000/paydunya/create-invoice', invoiceData)
      );
      
      if (response.data.response_code === '00') {
        return response.data.response_text;  // URL de redirection
      } else {
        throw new Error('Erreur de création de la facture PayDunya');
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel à PayDunya:', error);
      throw new Error('Erreur lors de la communication avec PayDunya');
    }
  }
}
