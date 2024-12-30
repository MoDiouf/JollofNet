import { Controller, Get } from '@nestjs/common';
import { PaytechService } from './paytech.service';


@Controller('payment')
export class PaytechController {
  constructor(private readonly paymentService: PaytechService) {}

  @Get('request')
  async requestPayment() {
    try {
      const paymentDetails = await this.paymentService.requestPayment();
      return { 
        success: true, 
        redirectUrl: paymentDetails.redirectUrl 
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de paiement',
      };
    }
  }
}
