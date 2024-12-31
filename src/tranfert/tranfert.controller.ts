import { Controller, Post, Body } from '@nestjs/common';
import { CreateTransferDto } from './DTO/create-transfert.dto';
import { TransfertService } from './tranfert.service';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransfertService) {}

  @Post()
  async createTransfer(@Body() transferData: CreateTransferDto) {
    const { totalPayment, apiKey, password, myOrangeMoneyAccount, otherOrangeMoneyAccount, lang } = transferData;
    console.log(transferData);

    // Authentification et récupération du token
    let token;
    try {
      token = await this.transferService.authenticate(apiKey, password, lang);
    } catch (error) {
      return {
        success: false,
        message: `Erreur d'authentification: ${error.message}`,
      };
    }

    // Vérification du solde
    let balance;
    try {
      balance = await this.transferService.checkBalance(token, lang);
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la vérification du solde: ${error.message}`,
      };
    }

    if (balance < totalPayment) {
      return {
        success: false,
        message: 'Solde insuffisant',
      };
    }

    // Préparer les données de transfert pour les deux comptes
    const transferDataArray = [
      {
        prefix: '225', // Code pays pour la Côte d'Ivoire (ajustez si nécessaire)
        phone: myOrangeMoneyAccount,
        amount: totalPayment,
        notify_url: 'http://yourdomain.com/transfer/notify', // Remplacez par votre URL de notification
      },
      {
        prefix: '225', // Code pays pour la Côte d'Ivoire (ajustez si nécessaire)
        phone: otherOrangeMoneyAccount,
        amount: totalPayment,
        notify_url: 'http://yourdomain.com/transfer/notify', // Remplacez par votre URL de notification
      }
    ];

    // Effectuer le transfert
    try {
      const transferResponse = await this.transferService.sendMoney(token, transferDataArray, lang);
      return {
        success: true,
        message: 'Transfert effectué avec succès',
        data: transferResponse,
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors du transfert: ${error.message}`,
      };
    }
  }
}
