import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { CreateWifiDto } from './DTO/create-wifi.dto';
import { ReseauInfo } from 'src/add-network/entities/reseaux.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddNetworkService } from 'src/add-network/add-network.service';
import { ModemInfo } from 'src/add-network/entities/modemInfo.entity';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class ManageService {
  private readonly baseURL = 'https://192.168.1.1';

  constructor(

    @InjectRepository(ReseauInfo)
    private ReseauInfoRepository: Repository<ReseauInfo>, 
    @InjectRepository(ModemInfo)
    private modemInfoRepository: Repository<ModemInfo>, 
    private readonly addNetworkService: AddNetworkService
  ) {}
  async changePassword(
    nameNet: string,
    newPassword: string,
    modemUsername: string,
    modemPassword: string,
    userId:number
  ): Promise<boolean> {
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

      await page.type('#Frm_Username', modemUsername);
      await page.type('#Frm_Password', modemPassword);
      await page.click('#LoginId');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      // Accéder aux paramètres réseau
      await page.waitForSelector('#localnet');
      console.log('Accès au réseau local...');
      await page.click('#localnet');

      await page.waitForSelector('#wlanConfig');
      console.log('Accès aux paramètres WLAN...');
      await page.click('#wlanConfig');

      await page.waitForSelector('#WLANSSIDConfBar');
      console.log('Tous les réseaux...');
      await page.click('#WLANSSIDConfBar');

      let i = 0;
while (i <= 5) {
  const essidSelector = `#ESSID\\:${i}`;
  const enable1Selector = `#Enable1\\:${i}`;
  const keyPassphraseSelector = `#KeyPassphrase\\:${i}`;
  const applyButtonSelector = `#Btn_apply_WLANSSIDConf\\:${i}`;
  const instNameSelector = `#instName_WLANSSIDConf\\:${i}`;

  try {
    // Vérifie si le sélecteur ESSID existe pour cet index
    await page.waitForSelector(essidSelector, { timeout: 2000 });
  } catch (error) {
    console.warn(`Sélecteur introuvable : ${essidSelector}. Arrêt de la boucle.`);
    break; // Quitte la boucle si le sélecteur n'existe pas
  }

  try {
    // Récupérer la valeur ESSID
    const essidValue = await page.$eval(
      essidSelector,
      (el: HTMLInputElement) => el.value,
    );

    // Vérifier si le réseau est activé
    const isEnabled = await page.$eval(
      enable1Selector,
      (el: HTMLInputElement) => el.checked,
    );
    if (essidValue === nameNet && isEnabled) {
      await page.waitForSelector(instNameSelector);
      await page.click(instNameSelector);
      await this.delay(2000);

      // Modifier le mot de passe
      await page.$eval(keyPassphraseSelector, (el: HTMLInputElement) => el.value = '');
      await page.type(keyPassphraseSelector, newPassword);
      await page.click(applyButtonSelector);

      // Cliquer à nouveau sur le bouton Appliquer pour garantir que les changements soient appliqués
      await page.click(applyButtonSelector);

      // Attendre quelques secondes pour s'assurer que les changements ont été effectués
      await this.delay(5000);

      console.log('Mot de passe modifié avec succès.');
      this.UpdatePassword(nameNet, newPassword, userId);
      return true; // Retourner true lorsque le mot de passe est modifié avec succès
    }
  } catch (error) {
    console.log(
      `Erreur lors de la vérification ou de la modification pour l'index ${i} :`,
      error,
    );
  }

  i++; // Incrémenter l'index pour passer à l'itération suivante
}


      // Si aucun réseau n'a été trouvé ou modifié
      console.log('Aucun réseau correspondant trouvé ou modifié.');
      return false; // Retourner false si le changement n'a pas pu être effectué
    } catch (err) {
      console.log("Erreur lors de l'interaction avec le modem :", err);
      return false; // Retourner false en cas d'erreur
    } finally {
      console.log("Fermeture du navigateur...");
      await browser.close();
    }
  }

  private delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async CreateNewWifi(InfoNewWifi: CreateWifiDto, Username: string, Password: string,idUser:number) {
    //console.log(InfoNewWifi);

    const browser = await puppeteer.launch({
      headless: false,
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

      await page.type('#Frm_Username', Username);
      await page.type('#Frm_Password', Password);
      await page.click('#LoginId');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      // Accéder à la configuration du réseau local
      await page.waitForSelector('#localnet');
      console.log('Accès au réseau local...');
      await page.click('#localnet');

      await page.waitForSelector('#wlanConfig');
      console.log('Accès aux paramètres WLAN...');
      await page.click('#wlanConfig');

      await page.waitForSelector('#WLANSSIDConfBar');
      console.log('Tous les réseaux...');
      await page.click('#WLANSSIDConfBar');

      const start = InfoNewWifi.networkFrequency === '2.4' ? 0 : 4;
      const end = InfoNewWifi.networkFrequency === '2.4' ? 4 : 7;

      for (let i = start; i <= end; i++) {
        const essidSelector = `#ESSID\\:${i}`;
        const enableSelector = `#Enable1\\:${i}`;
        const instNameSelector = `#instName_WLANSSIDConf\\:${i}`;
        const keyPassphraseSelector = `#KeyPassphrase\\:${i}`;
        const configMode = `#ACLPolicy2_${i}`
        const applyButtonSelector = `#Btn_apply_MACFilterACLPolicy`;
        try {
          await page.waitForSelector(enableSelector, { visible: true });
          const isChecked = await page.$eval(enableSelector, (el: HTMLInputElement) => el.checked);
          console.log(`#ESSID\\:${i}`);
          
          if (!isChecked) {
            console.log(`Réseau trouvé à l'index ${i}, avec la fréquence ${InfoNewWifi.networkFrequency} et désactivé.`);

            if (InfoNewWifi.scannable) {
              await page.waitForSelector('#wlanAdvanced');
              console.log('Accès aux paramètres avancés du WLAN pour configurer le mode.');
              await page.click('#wlanAdvanced');

              await page.waitForSelector(configMode);
              await page.click(configMode);
              console.log("Config");
              
              await page.waitForSelector('#Btn_apply_MACFilterACLPolicy'); // Sélecteur CSS basé sur l'ID

              // Cliquez sur le bouton
              await page.click('#Btn_apply_MACFilterACLPolicy');
              console.log("Apply");
              
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              await page.waitForSelector('#wlanConfig'); // Attendre que l'élément soit chargé
              /**/
              await page.click('#wlanConfig'); // Cliquer sur l'élément
              console.log('Accès aux paramètres basic du WLAN pour activer le reseau.');
              

              await page.waitForSelector('#WLANSSIDConfBar');
              console.log('Tous les réseaux...');
              await page.click('#WLANSSIDConfBar');
              
              await page.waitForSelector(instNameSelector);
              await page.click(instNameSelector);

              // Changer le nom et le mot de passe du réseau
              await page.$eval(essidSelector, (el: HTMLInputElement, newEssid) => el.value = newEssid, InfoNewWifi.nomReseau);
              await page.$eval(keyPassphraseSelector, (el: HTMLInputElement, newPassword) => el.value = newPassword, InfoNewWifi.newpasseword);

              // Configurer la visibilité du réseau
              const visibilitySelector = InfoNewWifi.networkVisibility === 'public' ? `#ESSIDHideEnable1\\:${i}` : `#ESSIDHideEnable0\\:${i}`;
              await page.$eval(visibilitySelector, (el: HTMLInputElement) => { if (!el.checked) el.click(); });

              // Activer le réseau
              await page.$eval(enableSelector, (el: HTMLInputElement) => { if (!el.checked) el.click(); });

              // Appliquer les modifications
              await page.click(`#Btn_apply_WLANSSIDConf\\:${i}`);
              await page.click(`#Btn_apply_WLANSSIDConf\\:${i}`);
              const selector = '.succHint';
              await page.waitForSelector(selector);
              console.log("Les modifications ont été appliquées pour le réseau.");/**/
              await new Promise(resolve => setTimeout(resolve, 3000))
              break;

            } else {
              await page.waitForSelector(instNameSelector);
              await page.click(instNameSelector);

              // Changer le nom et le mot de passe du réseau
              await page.$eval(essidSelector, (el: HTMLInputElement, newEssid) => el.value = newEssid, InfoNewWifi.nomReseau);
              await page.$eval(keyPassphraseSelector, (el: HTMLInputElement, newPassword) => el.value = newPassword, InfoNewWifi.newpasseword);

              // Configurer la visibilité du réseau
              const visibilitySelector = InfoNewWifi.networkVisibility === 'public' ? `#ESSIDHideEnable1\\:${i}` : `#ESSIDHideEnable0\\:${i}`;
              await page.$eval(visibilitySelector, (el: HTMLInputElement) => { if (!el.checked) el.click(); });

              // Activer le réseau
              await page.$eval(enableSelector, (el: HTMLInputElement) => { if (!el.checked) el.click(); });
              // Appliquer les modifications
              page.waitForSelector(`#Btn_apply_WLANSSIDConf\\:${i}`)
              await page.click(`#Btn_apply_WLANSSIDConf\\:${i}`);
              page.waitForSelector(`#Btn_apply_WLANSSIDConf\\:${i}`)
              await page.click(`#Btn_apply_WLANSSIDConf\\:${i}`);
              const selector = '.succHint';
              await page.waitForSelector(selector);


              //Autres Clicks
              await page.evaluate(() => {
                document.querySelector(`#Btn_apply_WLANSSIDConf\\:${i}`)?.scrollIntoView();
              });
              
              await page.evaluate(() => {
                const button = document.querySelector(`#Btn_apply_WLANSSIDConf\\:${i}`);
                if (button) {
                  button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                }
              });
              
              

              console.log("Les modifications ont été appliquées pour le réseau.");
              break;
            }
            
          }else{
            console.log("Aucun reseau trouvé");          
          }
        } catch (error) {
          console.error(`Erreur lors de la vérification du réseau à l'index ${i}:`, error);
          continue; // Passe au prochain réseau en cas d'erreur
        }
      }
    } catch (error) {
      console.error("Erreur lors de la configuration du WiFi :", error);
    } finally {
      await browser.close();
      if (InfoNewWifi.networkPayment =='free') {
        this.CreateWifiUpdate(idUser,InfoNewWifi.nomReseau,InfoNewWifi.newpasseword,0,false,InfoNewWifi.scannable?true:false)
      }else{
        this.CreateWifiUpdate(idUser,InfoNewWifi.nomReseau,InfoNewWifi.newpasseword,InfoNewWifi.prix,true,InfoNewWifi.scannable?true:false)
      }
      
    }

    return true;
  }
  
  
  async UpdatePassword(nameNet:string , newPassword:string,Id:number ){
    const modem = await this.addNetworkService.SearchIfModem(Id)
    const IdModem = modem.id
    const networkToUpdate = await this.ReseauInfoRepository.findOne({
      where: { modem_id: IdModem, essid: nameNet },
    });

    if (!networkToUpdate) {
      console.log('Aucun réseau trouvé avec cet ESSID pour ce modem');
      return null;
    }

    // Mettre à jour le mot de passe pour le réseau trouvé
    networkToUpdate.password = newPassword; // Mettre à jour le mot de passe
    await this.ReseauInfoRepository.save(networkToUpdate); // Sauvegarder la mise à jour
    console.log(`Mot de passe du réseau ${nameNet} mis à jour.`);

    
  }

  async CreateWifiUpdate(id:number,nomReseau:string,password:string,prix:number,payant:boolean,scannable:boolean){
    try {

      
      const nouveauReseau = this.ReseauInfoRepository.create({
        modem_id: id,
        essid: nomReseau,
        password: password,
        prix_unitaire:prix,
        payant:payant,
        scan:scannable
      });

    await this.ReseauInfoRepository.save(nouveauReseau);
  

    } catch (error) {
      console.error('Erreur lors de la sauvegarde du réseau :', error);
      throw new Error('Impossible de sauvegarder le réseau');
    }
  }

  async deleteWifi(networkDelete: string, username: string, password: string,userID:number) {
    const browser = await puppeteer.launch({
      headless: false,
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
  
      // Connexion
      await page.type('#Frm_Username', username);
      await page.type('#Frm_Password', password);
      await page.click('#LoginId');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
      // Navigation vers les paramètres WLAN
      await page.waitForSelector('#localnet');
      console.log('Accès au réseau local...');
      await page.click('#localnet');
  
      await page.waitForSelector('#wlanConfig');
      console.log('Accès aux paramètres WLAN...');
      await page.click('#wlanConfig');
  
      await page.waitForSelector('#WLANSSIDConfBar');
      console.log('Tous les réseaux...');
      await page.click('#WLANSSIDConfBar');
  
      // Recherche et comparaison des ESSID
      let i = 0;
      while (true) {
        const essidSelector = `#ESSID\\:${i}`;
        const radioButtonSelector = `#Enable0\\:${i}`;
        const applyButtonSelector = `#Btn_apply_WLANSSIDConf\\:${i}`;
  
        try {
          // Vérifie si le sélecteur ESSID existe
          await page.waitForSelector(essidSelector, { timeout: 2000 });
  
          // Récupère la valeur ESSID
          const essidValue = await page.$eval(
            essidSelector,
            (el: HTMLInputElement) => el.value,
          );
  
          console.log(`ESSID trouvé à l'index ${i} : ${essidValue}`);
  
          // Compare la valeur ESSID avec `networkDelete`
          if (essidValue === networkDelete) {
            console.log(`Réseau correspondant trouvé : ${essidValue}`);
            await page.waitForSelector(radioButtonSelector, { timeout: 2000 });
            await page.click(radioButtonSelector);
            console.log(`Bouton radio cliqué pour l'index ${i}.`);

            await page.waitForSelector(applyButtonSelector, { timeout: 2000 });
            await page.click(applyButtonSelector);
            await page.click(applyButtonSelector);
            break; // Quitte la boucle une fois le réseau supprimé
          }
        } catch (error) {
          console.warn(`Sélecteur introuvable pour ESSID:${i}. Arrêt de la boucle.`);
          break; // Quitte la boucle si le sélecteur n'existe pas
        }
  
        i++; // Incrémentation de l'index pour la prochaine itération
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du réseau :", error);
      return false
    } finally {
      console.log("Fermeture du navigateur...");
      await browser.close();
      this.updateDeleteWifi(networkDelete,userID)
      return true
    }
  }
  
  async updateDeleteWifi(NetToDelete: string, userID: number){
    try {
      // Recherche du réseau avec modem_id et essid correspondant
      const modemInfo = await this.ReseauInfoRepository.findOne({
        where: { modem_id: userID, essid: NetToDelete },
      });
  
      if (!modemInfo) {
        console.warn(
          `Aucun réseau trouvé pour modem_id: ${userID} et essid: ${NetToDelete}.`,
        );
        return false; // Aucun réseau correspondant trouvé
      }
  
      // Suppression du réseau correspondant
      await this.ReseauInfoRepository.delete(modemInfo.id);
  
      console.log(
        `Le réseau avec essid: ${NetToDelete} pour le modem_id: ${userID} a été supprimé avec succès.`,
      );
      
    } catch (error) {
      console.error("Erreur lors de la suppression du réseau :", error);
    }
  }
  
  async refreshModem(modem:any):Promise<any>{  
    const networks = await this.addNetworkService.processModem(modem)
    if (networks) {
      return networks
    }else{
      return false
    }
  }
  
  async deleteDataModem(userId : number){

    try {

      const resultReseau = await this.ReseauInfoRepository.delete({ modem_id: userId });

      const resultModem = await this.modemInfoRepository.delete({ utilisateur_id: userId });

      const totalDeleted = (resultReseau.affected || 0) + (resultModem.affected || 0);
  
      if (totalDeleted > 0) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
      return {
        success: false,
        message: 'Une erreur est survenue lors de la suppression.',
      };
    }
  }

  async getDataModem(idUser:number){

    return await this.modemInfoRepository.findOne({where:{utilisateur_id : idUser}})

  }
  async generateQrCodes(id: number) {
    const reseaux = await this.ReseauInfoRepository.find({ where: { modem_id: id } });
  
    if (reseaux.length === 0) {
      console.log('Aucun réseau trouvé pour ce modem_id');
      return [];
    }
  
    const generatedQrCodes = [];
  
    for (const reseau of reseaux) {
      try {
        // Si le réseau doit être scannable, générer un UUID si inexistant
        if (reseau.scan) {
          // Générer un UUID unique si inexistant
          if (!reseau.link) {
            reseau.link = uuidv4();
            await this.ReseauInfoRepository.save(reseau); // Sauvegarder le nouvel UUID
          }
  
          // Créer l'URL unique pour ce réseau (avec redirection vers client-connect)
          const uniqueUrl = `http://192.168.1.28:3000/client-connect/${reseau.link}`;
  
          // Créer le contenu du QR code
          const qrData = uniqueUrl;
  
          // Générer le QR code via l'API
          const response = await axios.get('https://api.qrserver.com/v1/create-qr-code/', {
            params: {
              data: qrData,
              size: '200x200',
            },
            responseType: 'arraybuffer',
          });
  
          // Convertir en base64
          const qrCode = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
  
          // Sauvegarder dans la base de données
          reseau.qrCode = qrCode;
          await this.ReseauInfoRepository.save(reseau);
  
          console.log(`QR code généré pour le réseau ${reseau.essid}`);
          generatedQrCodes.push(reseau);
        } else {
          // Si 'scan' est false, ne pas générer un QR code avec redirection
          const qrData = `WIFI:S:${reseau.essid};T:${reseau.encryption_type || 'WPA'};P:${reseau.password};;`;
  
          // Générer le QR code sans redirection
          const response = await axios.get('https://api.qrserver.com/v1/create-qr-code/', {
            params: {
              data: qrData,
              size: '200x200',
            },
            responseType: 'arraybuffer',
          });
  
          // Convertir en base64
          const qrCode = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
  
          // Sauvegarder dans la base de données
          reseau.qrCode = qrCode;
          await this.ReseauInfoRepository.save(reseau);
  
          console.log(`QR code généré pour le réseau ${reseau.essid}`);
          generatedQrCodes.push(reseau);
        }
      } catch (error) {
        console.error(`Erreur lors de la génération du QR code pour le réseau ${reseau.essid}:`, error);
      }
    }
  
    return generatedQrCodes;
  }
  
  
  async getQr(id:number){
    return  await this.ReseauInfoRepository.find({ where: { modem_id: id } });
  }

 async AllData(id:number)
{
  return  await this.ReseauInfoRepository.find({ where: { modem_id: id } });
}

}
