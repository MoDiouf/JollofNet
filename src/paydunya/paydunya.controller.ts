import { Controller, Post, Body } from '@nestjs/common';
import { PayDunyaService } from './paydunya.service';
import * as crypto from 'crypto';
// Importez le DTO

@Controller('paydunya')
export class PayDunyaController {
  constructor(private readonly payDunyaService: PayDunyaService) {}

  @Post('create-invoice')
  async createInvoice(@Body() createInvoiceDto: any) {  // Utilisez le DTO ici
    const { items, totalAmount, description } = createInvoiceDto;
    const result = await this.payDunyaService.createInvoice(items, totalAmount, description);
    return result;
  }

  @Post('ipn')
  async handleIPN(@Body() payload: any) {
    const { data } = payload;
    const hash = data.hash;
    const calculatedHash = this.calculateHash(data);

    if (hash === calculatedHash && data.status === 'completed') {
      // Traitez la transaction ici
      console.log('Transaction réussie:', data);
    } else {
      console.log('Transaction échouée ou données invalides');
    }
  }

  private calculateHash(data: any) {
    const masterKey = process.env.PAYDUNYA_MASTER_KEY;
    const hash = crypto.createHash('sha512');
    hash.update(masterKey);
    return hash.digest('hex');
  }
}
