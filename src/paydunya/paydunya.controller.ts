import { Controller, Post, Body, BadRequestException, Logger, Headers } from '@nestjs/common';
import { PayDunyaService } from './paydunya.service';
import { CreateInvoiceDto } from './DTO/create-payment.dto';

@Controller('paydunya')
export class PayDunyaController {
  private readonly logger = new Logger(PayDunyaController.name);

  constructor(private readonly payDunyaService: PayDunyaService) {}

  // Route pour initier un paiement
  @Post('create-invoice')
  async createInvoice(@Body() invoiceData: any) {
    const result = await this.payDunyaService.createInvoice(invoiceData);
    return result;
  }
}
