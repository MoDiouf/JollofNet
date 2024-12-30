import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaytechService {
  private paymentRequestUrl = "https://paytech.sn/api/payment/request-payment";
  private headers = {
    Accept: "application/json",
    'Content-Type': "application/json",
    API_KEY: "3edf6680c2c9739774fbb0c5320e3fd7712dd5babef172e4469f879fd3ed1f51",
    API_SECRET: "4b93fae2d0adf19d7e5549bb3dcfb06dfe2351a6142f607c6250fc9f9ab747a6",
  };

  async requestPayment() {
    const itemPrice = 50000; // Le prix de l'article
    const commissionPercentage = 5; // Commission de 5%
    const commissionAmount = (itemPrice * commissionPercentage) / 100; // Calcul de la commission

    const params = {
      item_name: "Wifi",
      item_price: itemPrice.toString(), // On s'assure que c'est une chaîne
      currency: "XOF",
      ref_command: uuidv4(),
      command_name: "Paiement Iphone 7 Gold via PayTech",
      env: "test",
      ipn_url: "https://domaine.com/ipn",
      success_url: "https://domaine.com/success",
      cancel_url: "https://domaine.com/cancel",
      custom_field: JSON.stringify({
        custom_fiel1: "value_1",
        custom_fiel2: "value_2",
      }),
    };

    console.log('Request parameters:', params);

    try {
      const response = await fetch(this.paymentRequestUrl, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: this.headers,
      });
      
      const jsonResponse = await response.json();
      console.log('API Response:', jsonResponse);

      if (jsonResponse.success === 1) {
        return {
          redirectUrl: jsonResponse.redirect_url,
          token: jsonResponse.token,
          commissionAmount: commissionAmount,  // Ajout de la commission dans la réponse
          netAmount: itemPrice - commissionAmount, // Montant net après commission
        };
      } else {
        throw new Error('Erreur lors de la demande de paiement');
      }
      
    } catch (error) {
      console.error('Erreur de requête PayTech:', error);
      throw error;
    }
  }
}
