import { IsNumber, IsString, Min } from 'class-validator';

export class CreateTransferDto {
    totalPayment: number; // Montant total à transférer
    apiKey: string; // API key pour l'authentification
    password: string; // Mot de passe API
    myOrangeMoneyAccount: string; // Numéro du compte Orange Money de l'expéditeur
    otherOrangeMoneyAccount: string; // Numéro du compte Orange Money du destinataire
    lang: string; // Langue de la réponse (en ou fr)
  }
  