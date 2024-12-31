import { Injectable } from '@nestjs/common';
import * as paydunya from 'paydunya';

@Injectable()
export class PayDunyaService {
  private paydunyaSetup;
  private store;

  constructor() {
    // Configuration de PayDunya avec vos clés API
    this.paydunyaSetup = new paydunya.Setup({
      masterKey: 'KvlCXYXj-45u0-hEhe-1mR9-DI4ZyMZHjq1N',
      privateKey: 'test_private_G9iyIU0A2owgGhxwZgdRYprLndG',
      publicKey: 'test_public_40phsLadzgfmzC7W5qR3PXeAoNr',
      token: 'gMzUcsD1EoQ57BWMmxZA',
      mode: 'test', // ou 'live' en production
    });

    // Configuration du store (informations de votre service)
    this.store = new paydunya.Store({
      name: 'Magasin Chez Sandra',
      tagline: "L'élégance n'a pas de prix",
      phoneNumber: '336530583',
      postalAddress: 'Dakar Plateau - Etablissement kheweul',
      websiteURL: 'http://www.chez-sandra.sn',
      logoURL: 'http://www.chez-sandra.sn/logo.png',
    });
  }

  async createInvoice(items: any[], totalAmount: number, description: string) {
    const invoice = new paydunya.CheckoutInvoice(this.paydunyaSetup, this.store);

// Ajout des articles à la facture
items.forEach(item => {
  invoice.addItem(item.name, item.quantity, item.unitPrice, item.totalPrice, item.description);
});

// Définir le montant total de la facture
invoice.totalAmount = totalAmount;
invoice.description = description;

try {
  const isCreated = await invoice.create();
  if (isCreated) {
    return {
      status: 'success',
      token: invoice.token,  // Token de facture
      redirectUrl: invoice.url,  // URL de redirection pour payer
    };
  } else {
    console.log("Erreur PayDunya:", invoice.error);
    return { status: 'error', message: 'Erreur lors de la création de la facture' };
  }
} catch (error) {
  console.error("Erreur lors de la création de la facture:", error);
  return { status: 'error', message: error.message };
}

  }
  
}
