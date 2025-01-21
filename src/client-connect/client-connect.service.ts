import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModemInfo } from 'src/add-network/entities/modemInfo.entity';
import { UserConnected } from 'src/statistique/entities/userConnected.entity';
import { Repository } from 'typeorm';
import { ListClient } from './DTO/listClient.entity';
import * as puppeteer from 'puppeteer';
@Injectable()
export class ClientConnectService {
  constructor(
    @InjectRepository(ListClient)
    private ListClienRepository: Repository<ListClient>,
    @InjectRepository(ModemInfo)
    private ModemInfoRepository: Repository<ModemInfo>,
    @InjectRepository(UserConnected)
    private ModemUserRepository: Repository<UserConnected>,
  ) {}
  private readonly baseURL = 'https://192.168.1.1';
  

  async addClient(
    userModem: string,
    passModem: string,
    macAddress: string,
    nom: string,
    essidName: string,
  ): Promise<boolean > {

    console.log("AddClienttttttt");
    
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
  
      // Accéder à l'URL principale
      await page.goto(this.baseURL, { waitUntil: 'networkidle2' });
  
      // Connexion au modem
      await page.type('#Frm_Username', userModem);
      await page.type('#Frm_Password', passModem);
      await page.click('#LoginId');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
      // Navigation vers les sections nécessaires
      await page.waitForSelector('a#localnet');
      await page.click('a#localnet');
  
      await page.waitForSelector('a#lanConfig');
      await page.click('a#wlanConfig');
  
      await page.waitForSelector('h1#WLANSSIDConfBar');
      await page.click('h1#WLANSSIDConfBar');
  
      // Boucle sur les éléments avec l'ID dynamique `instName_WLANSSIDConf:X`
      let index = 0;
      let searchIndex = undefined
      let found = false;
      while (true) {
        const selector = `a#instName_WLANSSIDConf\\:${index}`;
        const exists = await page.$(selector); // Vérifie si l'élément existe
  
        if (!exists) break; // Si l'élément n'existe plus, arrêter la boucle
  
        // Clic sur l'élément
        await page.click(selector);
  
        // Attendre que l'input correspondant soit visible
        const inputSelector = `input#ESSID:${index}`;
        await page.waitForSelector(inputSelector);
  
        // Récupérer la valeur de l'input
        const inputValue = await page.$eval(inputSelector, (input: HTMLInputElement) => input.value);
  
        // Vérifier si la valeur correspond
        if (inputValue === essidName) {
          console.log(`ESSID correspondant trouvé : ${inputValue}`);
          searchIndex = index + 1
          found = true;
          break;
        }
  
        index++; // Passer à l'élément suivant
      }
  
      if (!found) {
        console.log('Aucun ESSID correspondant trouvé.');
      }

      await page.waitForSelector('p#wlanAdvanced'); // Attendre que l'élément soit présent
      await page.click('p#wlanAdvanced'); // Cliquer sur l'élément
    console.log('Navigué vers "WLAN Advanced".');

    
    await page.waitForSelector('h1#MACFilterRuleBar'); // Attendre que l'élément soit présent
      await page.click('h1#MACFilterRuleBar');


      let compteur = 0; // Initialisation du compteur
      let indexx = 0; // Initialisation de l'index
      
      // Boucle pour compter les éléments avec des IDs spécifiques
      while (true) {
        const selector = `#instName_MACFilterRule\\:${indexx}`; // Échappement du caractère `:`
        const element = await page.$(selector); // Vérifie si l'élément existe
      
        if (element) {
          compteur++; // Incrémente le compteur si l'élément existe
          indexx++; // Passe à l'élément suivant
        } else {
          break; // Arrête la boucle dès qu'un ID manquant est rencontré
        }
      }
      
      console.log("Nombre d'éléments disponibles :", indexx);
      
      // Attendre l'élément pour ajouter une nouvelle entrée
      await page.waitForSelector('span#addInstBar_MACFilterRule'); 
      await page.click('span#addInstBar_MACFilterRule');
      
      // Sélecteur pour l'input basé sur l'index actuel
      const inputSelector = `#Name\\:${indexx}`;
      
      // Attendre que l'input soit visible
      await page.waitForSelector(inputSelector, { timeout: 20000 });
      
      // Modifier la valeur du champ d'entrée
      await page.$eval(inputSelector, (input, text) => {
        const inputElement = input as HTMLInputElement; // Conversion explicite en HTMLInputElement
        inputElement.value = ''; // Effacer le contenu existant
        inputElement.value = text; // Définir le nouveau texte
      }, nom);
      // Sélecteur pour le menu déroulant
      const selectSelector = `#Interface\\:${indexx}`;
      
      // Attendre que le menu déroulant soit disponible
      await page.waitForSelector(selectSelector);
      
      // Sélectionner une option basée sur son index
      const optionIndex = index; // Index de l'option à sélectionner (par exemple, la première option)
      const optionValue = await page.$eval(
        `${selectSelector} option:nth-child(${optionIndex})`,
        (option) => option.value
      );
      
      // Sélectionner l'option dans le menu déroulant
      await page.select(selectSelector, optionValue);
      
      console.log("Nouvelle entrée ajoutée et sélection configurée.");
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour', error);
      return false
    } finally {
      //await browser.close(); // Fermer le navigateur
      return true
    }
  }
  
  async RouteurInfo(id){

    return await  this.ModemInfoRepository.findOne({where:{utilisateur_id:id}})
  }

  async updateGain(idUser: number, gain: number) {
    const gainUp = await this.ModemUserRepository.findOne({
      where: { id: idUser },
    });
    if (!gainUp) {
      console.log('Utilisateur non trouvé');
      return;
    }
    // Calculer le nouveau gain et incrémenter le nombre de connexions
    const newGain = gainUp.gain + gain;
    const newNumberConnected = gainUp.number_connected + 1;

    // Mettre à jour les champs nécessaires
    gainUp.gain = newGain;
    gainUp.number_connected = newNumberConnected;

    // Sauvegarder les modifications
    await this.ModemUserRepository.save(gainUp);

    console.log(
      `Gain et nombre de connexions mis à jour pour l'utilisateur ${idUser}: Nouveau gain = ${newGain}, Nombre de connexions = ${newNumberConnected}`,
    );
  }
  async addListClient(nom: string, macAddress: string): Promise<void> {
    const newClient = this.ListClienRepository.create({
      nom,
      macAddress,
    });
    await this.ListClienRepository.save(newClient);
  }
}
