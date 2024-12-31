import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; 
import { AxiosResponse } from 'axios';

@Injectable()
export class TransfertService {
  constructor(private readonly httpService: HttpService) {}

  // Méthode d'authentification pour obtenir un token
  async authenticate(apiKey: string, password: string, lang: string): Promise<string> {
    const url = 'https://client.cinetpay.com/v1/auth/login';
    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('password', password);
    params.append('lang', lang);

    try {
      const response: AxiosResponse = await this.httpService.post(url, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }).toPromise();

      if (response.data.code === 0) {
        return response.data.data.token;
      } else {
        throw new InternalServerErrorException(`Erreur d'authentification: ${response.data.message}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(`Erreur lors de l'authentification: ${error.message}`);
    }
  }

  // Méthode pour vérifier le solde du compte
  async checkBalance(token: string, lang: string): Promise<number> {
    const url = 'https://client.cinetpay.com/v1/transfer/check/balance';
    const params = {
      token: token,
      lang: lang,
    };

    try {
      const response: AxiosResponse = await this.httpService.get(url, { params }).toPromise();

      if (response.data.code === 0) {
        return response.data.data.available;
      } else {
        throw new InternalServerErrorException(`Erreur lors de la vérification du solde: ${response.data.message}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(`Erreur lors de la vérification du solde: ${error.message}`);
    }
  }

  // Méthode pour envoyer l'argent entre les deux contacts
  async sendMoney(token: string, transferData: any[], lang: string): Promise<any> {
    const url = 'https://client.cinetpay.com/v1/transfer/money/send/contact';
    const params = {
      token: token,
      lang: lang,
    };

    try {
      const response: AxiosResponse = await this.httpService.post(url, { data: transferData }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: params,
      }).toPromise();

      if (response.data.code === 0) {
        return response.data.data;
      } else {
        throw new InternalServerErrorException(`Erreur lors de l'envoi de l'argent: ${response.data.message}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(`Erreur lors de l'envoi de l'argent: ${error.message}`);
    }
  }
}
