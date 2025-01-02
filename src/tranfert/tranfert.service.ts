import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TransfertService {
  private readonly apiUrl = 'https://sandbox.cinetpay.com/v1';
  private readonly apiKey = '197315885967740c26279e35.07185461'; // Remplacez par votre clé API
  private readonly apiPassword = 'Sword@rtonline'; // Remplacez par votre mot de passe API

  // Récupération du token
  async getToken(): Promise<string> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/auth/login`,
        null,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          params: { apikey: this.apiKey, password: this.apiPassword },
        },
      );

      if (response.data.code === 0) {
        return response.data.data.token;
      } else {
        throw new HttpException(response.data.message, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération du token: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Initialiser un paiement
  async initiatePayment(amount: number, transaction_id: string): Promise<any> {
    const token = await this.getToken();

    const paymentData = {
      apikey: this.apiKey,
      site_id: '105884712', // Remplacez par votre site ID
      transaction_id,
      amount,
      currency: 'XOF', // Devise utilisée
      description: 'Paiement via CinetPay',
      return_url: 'http://votre-site.com/success', // URL de retour en cas de succès
      notify_url: 'http://votre-site.com/notify', // URL de notification
      customer_name: 'John Doe', // Optionnel
      customer_email: 'johndoe@example.com', // Optionnel
    };

    try {
      const response = await axios.post(
        `${this.apiUrl}/payment`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.code === 0) {
        return response.data.data;
      } else {
        throw new HttpException(response.data.message, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(
        `Erreur lors de l'initialisation du paiement: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
