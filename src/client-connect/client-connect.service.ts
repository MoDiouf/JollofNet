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
  ): Promise<boolean | void> {

    console.log("AddClienttttttt");
    
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
      await page.click('a#lanConfig');
  
      await page.waitForSelector('h1#WLANSSIDConfBar');
      await page.click('h1#WLANSSIDConfBar');
  
      // Boucle sur les éléments avec l'ID dynamique `instName_WLANSSIDConf:X`
      let index = 0;
      let searchIndex = undefined
      let found = false;
      while (true) {
        const selector = `a#instName_WLANSSIDConf:${index}`;
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

    await page.evaluate(() => {
        const div = document.querySelector('#MACFilterRule_container');
        if (div && div instanceof HTMLElement && div.style.display === 'none') {
          div.style.display = 'block'; // Modifier display: none à display: block
        }
      });
    
      // Vérifier que la div est bien maintenant en display: block
      const isVisible = await page.$eval('#MACFilterRule_container', el => {
        const style = window.getComputedStyle(el);
        return style.display === 'block'; // Retourne vrai si la div est en block
      });
    
      console.log(isVisible ? 'La div est maintenant visible' : 'La div est toujours cachée');
      await page.evaluate(() => {
        // Sélectionner les deux div par leurs IDs
        const templateDiv = document.querySelector('#template_MACFilterRule') as HTMLElement;
        const changeAreaDiv = document.querySelector('#changeArea_MACFilterRule') as HTMLElement;
      
        // Vérifier si les div existent et modifier leur style
        if (templateDiv) {
          templateDiv.style.display = 'block';
        }
        if (changeAreaDiv) {
          changeAreaDiv.style.display = 'block';
        }
      });

      const inputSelector = `#Name`;
      // Attendre que l'input soit visible
      await page.waitForSelector(inputSelector,{timeout:20000});

      // Cliquer pour sélectionner le champ
      await page.click(inputSelector);
      await page.$eval(inputSelector, (input: HTMLInputElement, text: string) => {
        input.value = ''; // Efface l'ancien contenu
        input.value = text; // Définit le nouveau texte
      }, nom);

      const selectSelector = `#Interface`;
              await page.waitForSelector(selectSelector);
              const optionIndex = index; // `nth-child` commence à 1 en CSS, donc on utilise `i + 1`
              const optionValue = await page.$eval(
                `${selectSelector} option:nth-child(${optionIndex})`,
                (option: HTMLOptionElement) => option.value
              );
              await page.select(selectSelector, optionValue);

    } catch (error) {
      console.error('Erreur lors de la mise à jour', error);
    } finally {
      await browser.close(); // Fermer le navigateur
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
