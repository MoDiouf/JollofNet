import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReseauInfo } from 'src/add-network/entities/reseaux.entity';

@Controller('client-connect')
export class ClientConnectController {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ReseauInfo)
    private ReseauInfoRepository: Repository<ReseauInfo>
  ) {}

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

    // Données de la facture à envoyer
    const invoiceData = {
      invoice: {
        total_amount: 1000,
        description: "Chaussure VANS dernier modèle",
      },
      store: {
        name: "Magasin Chez Sandra",
        tagline: "L'élégance n'a pas de prix",
        phone_number: "336530583",
        postal_address: "Dakar Plateau - Etablissement kheweul",
        website_url: "http://www.chez-sandra.sn",
        logo_url: "http://www.chez-sandra.sn/logo.png",
      },
    };

    try {
      // Effectuer un appel POST vers le service PayDunya
      const paymentUrl = await this.createInvoice(invoiceData);

      // Réponse avec l'URL de paiement
      return res.redirect(paymentUrl);
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      return res.status(500).send('Erreur lors de la création de la facture');
    }
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
