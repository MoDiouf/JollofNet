import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReseauInfo } from 'src/add-network/entities/reseaux.entity';
import { ClientConnectService } from './client-connect.service';
import { ModemInfo } from 'src/add-network/entities/modemInfo.entity';

@Controller('client-connect')
export class ClientConnectController {
  constructor(
    private readonly ClientService: ClientConnectService,
    private readonly httpService: HttpService,
    @InjectRepository(ReseauInfo)
    private ReseauInfoRepository: Repository<ReseauInfo>,
    
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
async handleClientForm(@Body() body: any, @Res() res: Response, @Req() req: Request) {
  const { modem_id, essid, mac1, mac2, mac3, mac4, mac5, mac6, nom } = body;
  const userModem = req.session.user.modemUsername;
  const passModem = req.session.user.modemPassword;

  // Recherche du réseau dans la base de données
  const reseau = await this.ReseauInfoRepository.findOne({
    where: { essid: essid, modem_id: modem_id },
  });

  if (!reseau) {
    return res.status(404).send('Réseau introuvable');
  }

  // Concaténer les parties de l'adresse MAC
  const macAddress = [mac1, mac2, mac3, mac4, mac5, mac6].join(':');

  console.log("Nom:", nom);
  console.log("Modem ID:", modem_id);
  console.log("ESSID:", essid);
  console.log("Adresse MAC:", macAddress);

  // Si le réseau est payant, initier le processus de paiement
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
      // Création de la facture et récupération de l'URL de paiement
      const paymentUrl = await this.createInvoice(invoiceData);

      // Stocker temporairement les données client pour traitement après paiement
      req.session.pendingClientData = {
        userModem,
        passModem,
        macAddress,
        nom,
      };

      console.log('Redirection vers URL de paiement:', paymentUrl);
      return res.redirect(paymentUrl);
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      return res.status(500).send('Erreur lors de la création de la facture');
    }
  }

  // Si le réseau n'est pas payant, ajouter directement le client
  await this.ClientService.addClient(userModem, passModem, macAddress,nom);
  this.ClientService.addListClient(nom,macAddress)
  console.log('Client ajouté sans paiement.');
  return res.status(200).send('Client ajouté avec succès');
}


@Post('ipn')
async handleIPN(@Body() body: any, @Res() res: Response, @Req() req: Request) {
  console.log('IPN reçu:', body);

  const { status, transaction_id, amount } = body;

  if (status === 'completed') {
    console.log(`Paiement réussi pour la transaction ${transaction_id}. Montant : ${amount}`);

      this.ClientService.updateGain(req.session.user.id,amount)
    // Vérifiez et récupérez les données client stockées
    const { userModem, passModem, macAddress,nom } = req.session.pendingClientData || {};
    if (userModem && passModem && macAddress && nom) {
      await this.ClientService.addClient(userModem, passModem, macAddress,nom);
      console.log('Client ajouté après paiement.');
      this.ClientService.addListClient(nom,macAddress)
      req.session.pendingClientData = null; 
      
    }
  } else {
    console.log(`Paiement échoué ou en attente pour la transaction ${transaction_id}`);
  }

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
