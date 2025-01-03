import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as paydunya from 'paydunya';

@Injectable()
export class PayDunyaService {
  private readonly baseUrl: string = 'https://app.paydunya.com/sandbox-api/v1/checkout-invoice/create';
  private readonly headers = {
    'PAYDUNYA-MASTER-KEY': 'KvlCXYXj-45u0-hEhe-1mR9-DI4ZyMZHjq1N',
    'PAYDUNYA-PRIVATE-KEY': 'test_private_G9iyIU0A2owgGhxwZgdRYprLndG',
    'PAYDUNYA-TOKEN': 'gMzUcsD1EoQ57BWMmxZA',
    'Content-Type': 'application/json',
  };

  async createInvoice(invoiceData: any) {
    try {
      const response = await axios.post(this.baseUrl, invoiceData, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la facture', error);
      throw new Error('Erreur lors de la création de la facture');
    }
  }
}
