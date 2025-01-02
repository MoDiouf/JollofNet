import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { TransfertService } from './tranfert.service';


@Controller('cinetpay')
export class TransferController {
  constructor(private readonly paymentService: TransfertService) {}

  @Post('initiate-payment')
  async initiatePayment(@Body() body: { amount: number; transaction_id: string }): Promise<any> {
    const { amount, transaction_id } = body;

    // Vérifier si le montant est valide
    if (amount < 5) {
      throw new HttpException(
        'Le montant minmum est de 5.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.paymentService.initiatePayment(amount, transaction_id);
      return {
        message: 'Paiement initié avec succès.',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de l'initialisation du paiement: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
