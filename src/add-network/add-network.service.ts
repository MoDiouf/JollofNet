import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ModemInfo } from './entities/modemInfo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Network } from './interfaces/network.interface';
@Injectable()
export class AddNetworkService {
  constructor(
    @InjectRepository(ModemInfo)
    private modemInfoRepository: Repository<ModemInfo>, // Injection du repository
  ) {}
  private readonly baseURL = 'https://192.168.1.1';

  async createModemInfo(
    username: string,
    password: string,
  ): Promise<ModemInfo> {
    const modemInfo = this.modemInfoRepository.create({});
    return await this.modemInfoRepository.save(modemInfo);
  }

  async findAllModemInfo(): Promise<ModemInfo[]> {
    console.log('Data');

    return await this.modemInfoRepository.find();
  }

  async AddModem(
    username: string,
    password: string,
    id: number,
  ): Promise<string |boolean> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      });

      await page.goto(this.baseURL, { waitUntil: 'networkidle2' });
      await page.type('#Frm_Username', username);
      await page.type('#Frm_Password', password);
      await page.click('#LoginId');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      const modemInfo = await this.modemInfoRepository.findOneBy({
        utilisateur_id: id,
      });

      if (modemInfo) {
        modemInfo.modem_username = username;
        modemInfo.modem_mot_de_passe = password;
        await this.modemInfoRepository.save(modemInfo);
        console.log('Mise à jour réussie');
      } else {
        const newModemInfo = this.modemInfoRepository.create({
          modem_username: username,
          modem_mot_de_passe: password,
          utilisateur_id: id,
          gains: 0,
        });
        await this.modemInfoRepository.save(newModemInfo);
      }

      return true;
    } catch (error) {
      console.error(
        'Erreur lors de la connexion avec Puppeteer:',
        error.message,
      
      );
      return false
    } finally {
      await browser.close();
    }
  }

  async SearchIfModem(utilisateur_id: number): Promise<ModemInfo | null> {
    const modem = await this.modemInfoRepository.findOne({
      where: { utilisateur_id },
    });

    if (modem.modem_username !== '' && modem.modem_mot_de_passe !== '') {
      return modem;
    } else {
      return null;
    }
  }
  async processModem(modem: any): Promise<Network[]> {
    console.log('Traitement du modem:');
    console.log('----------------------------------------');

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors',
      ],
    });

    const values: Network[] = []; // Déclarez un tableau de Network

    try {
      //console.log(modem);
      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      });

      await page.goto(this.baseURL, { waitUntil: 'networkidle2' });

      await page.type('#Frm_Username', modem.modem_username);
      await page.type('#Frm_Password', modem.modem_mot_de_passe);

      await page.click('#LoginId');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      await page.waitForSelector('#localnet');
      await page.click('#localnet');
      console.log('Accès au réseau local...');

      await page.waitForSelector('#wlanConfig');
      await page.click('#wlanConfig');
      console.log('Accès aux paramètres WLAN...');

      await page.waitForSelector('#WLANSSIDConfBar');
      await page.click('#WLANSSIDConfBar');
      console.log('Tous les réseaux...');

      for (let i = 0; i <= 5; i++) {
        const essidSelector = `#ESSID\\:${i}`;
        const encryptionTypeSelector = `#EncryptionType\\:${i}`;
        const essidHideSelector = `#ESSIDHideEnable0\\:${i}`;
        const enableSelector = `#Enable1\\:${i}`;
        const keyPassphraseSelector = `#KeyPassphrase\\:${i}`;

        const network: Network = {
          essid: null,
          encryptionType: null,
          essidHideEnabled: false,
          essidHideValue: null,
          enableChecked: false,
          enableValue: null,
          password: null,
        };

        try {
          const essidValue = await page.$eval(
            essidSelector,
            (el: HTMLInputElement) => el.value,
          );
          network.essid = essidValue;
        } catch {}

        try {
          const encryptionTypeValue = await page.$eval(
            encryptionTypeSelector,
            (el: HTMLSelectElement) => el.value,
          );
          network.encryptionType = encryptionTypeValue;
        } catch {}

        try {
          const isESSIDHideEnabled = await page.$eval(
            essidHideSelector,
            (el: HTMLInputElement) => el.checked,
          );
          network.essidHideEnabled = isESSIDHideEnabled;
          network.essidHideValue = isESSIDHideEnabled
            ? await page.$eval(
                essidHideSelector,
                (el: HTMLInputElement) => el.value,
              )
            : null;
        } catch {}

        try {
          const isChecked = await page.$eval(
            enableSelector,
            (el: HTMLInputElement) => el.checked,
          );
          network.enableChecked = isChecked;
          network.enableValue = isChecked
            ? await page.$eval(
                enableSelector,
                (el: HTMLInputElement) => el.value,
              )
            : null;
        } catch {}

        try {
          const passwordValue = await page.$eval(
            keyPassphraseSelector,
            (el: HTMLInputElement) => el.value,
          );
          network.password = passwordValue;
        } catch {}

        values.push(network); // Ajout de l'objet réseau au tableau
      }

      return values; // Retourne le tableau d'objets
    } catch (error) {
      console.error('Erreur lors du traitement du modem:', error);
    } finally {
      await browser.close(); // Assurez-vous de fermer le navigateur
    }
  }

  private delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
