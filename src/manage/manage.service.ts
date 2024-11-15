import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { CreateWifiDto } from './DTO/create-wifi.dto';
@Injectable()
export class ManageService {
  private readonly baseURL = 'https://192.168.1.1';

  async changePassword(
    nameNet: string,
    newPassword: string,
    modemUsername: string,
    modemPassword: string,
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

      for (let i = 0; i <= 5; i++) {
        const essidSelector = `#ESSID\\:${i}`;
        const enable1Selector = `#Enable1\\:${i}`;
        const keyPassphraseSelector = `#KeyPassphrase\\:${i}`;
        const applyButtonSelector = `#Btn_apply_WLANSSIDConf\\:${i}`;
        const instNameSelector = `#instName_WLANSSIDConf\\:${i}`;

        try {
          await page.waitForSelector(essidSelector, { timeout: 5000 });
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
            return true; // Retourner true lorsque le mot de passe est modifié avec succès
          }
        } catch (error) {
          console.log(
            `Erreur lors de la vérification ou de la modification pour l'index ${i} :`,
            error,
          );
        }
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

  async CreateNewWifi(InfoNewWifi: CreateWifiDto, Username: string, Password: string) {
    console.log(InfoNewWifi);

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

      const start = InfoNewWifi.networkFrequency === '2.4' ? 0 : 3;
      const end = InfoNewWifi.networkFrequency === '2.4' ? 2 : 5;

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

          if (!isChecked) {
            console.log(`Réseau trouvé à l'index ${i}, avec la fréquence ${InfoNewWifi.networkFrequency} et désactivé.`);

            if (InfoNewWifi.scannable) {
              await page.waitForSelector('#wlanAdvanced');
              console.log('Accès aux paramètres avancés du WLAN pour configurer le mode.');
              await page.click('#wlanAdvanced');

              await page.waitForSelector(configMode);
              await page.click(configMode);

              const applyMode = "Btn_apply_MACFilterACLPolicy"
              await page.waitForSelector(applyMode, { visible: true });
              await page.click(applyMode)

              await page.waitForSelector("#MACFilterRuleBar");
              await page.click("#MACFilterRuleBar");

              let index = 0;
              let count = 0;

              while (true) {
                const selector = `#topLine_MACFilterRule\\:${index}`;
                try {
                  // Essayer de sélectionner le div avec l'ID actuel
                  await page.waitForSelector(selector, { timeout: 2000 });
                  count++; // Incrémenter le compteur si le div est trouvé
                  index++; // Passer à l'index suivant
                } catch (error) {
                  // Si le div avec cet ID n'est pas trouvé, arrêter la boucle
                  console.log(`Aucun élément supplémentaire trouvé à l'index ${index}. Fin de la recherche.`);
                  break;
                }
              }

              console.log(`Nombre total de div avec l'ID sous la forme #topLine_MACFilterRule:${index} : ${count}`);

              await page.waitForSelector("#addInstBar_MACFilterRule");
              await page.click("#addInstBar_MACFilterRule");

              const inputSelector = `#Name\\:${count}`;
              // Attendre que l'input soit visible
              await page.waitForSelector(inputSelector);

              // Cliquer pour sélectionner le champ
              await page.click(inputSelector);
              await page.$eval(inputSelector, (input: HTMLInputElement, text: string) => {
                input.value = ''; // Efface l'ancien contenu
                input.value = text; // Définit le nouveau texte
              }, 'FirstApp');
              console.log(count);

              const selectSelector = `#Interface\\:${count}`;
              await page.waitForSelector(selectSelector);
              const optionIndex = i + 1; // `nth-child` commence à 1 en CSS, donc on utilise `i + 1`
              const optionValue = await page.$eval(
                `${selectSelector} option:nth-child(${optionIndex})`,
                (option: HTMLOptionElement) => option.value
              );
              await page.select(selectSelector, optionValue);

              for (let index = 0; index < 6; index++) {
                // Construire le sélecteur dynamique pour chaque input
                const inputSelector = `#sub_MACAddress${index}\\:14`;

                try {
                  // Vérifier si l'adresse MAC correspondante existe dans InfoNewWifi
                  const macAddressKey = `macAddress${index + 1}` as keyof typeof InfoNewWifi;
                  const macAddress = InfoNewWifi[macAddressKey];

                  if (!macAddress) {
                    console.warn(`InfoNewWifi.${macAddressKey} est introuvable ou vide, saut de l'input ${inputSelector}.`);
                    continue;
                  }

                  // Attendre que l'input soit visible
                  await page.waitForSelector(inputSelector, { visible: true });

                  // Remplir l'input avec la valeur correspondante
                  await page.$eval(inputSelector, (input: HTMLInputElement, value: string) => {
                    input.value = ''; // Efface l'ancien contenu
                    input.value = value; // Définit la nouvelle valeur
                  }, macAddress);

                  console.log(`Input ${inputSelector} rempli avec ${macAddress}`);
                } catch (error) {
                  console.error(`Erreur lors du remplissage de l'input ${inputSelector}:`, error);
                }
              }

              const applyButtonSelector = `#Btn_apply_MACFilterRule\\:${count}`;
              await page.waitForSelector(applyButtonSelector, { visible: true });
              await page.click(applyButtonSelector);

              await page.waitForSelector('#wlanBasic');
              console.log('Accès aux paramètres basic du WLAN pour activer le reseau.');
              await page.click('#wlanBasic')

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
              console.log("Les modifications ont été appliquées pour le réseau.");
              break;

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
              await page.click(`#Btn_apply_WLANSSIDConf\\:${i}`);
              await page.click(`#Btn_apply_WLANSSIDConf\\:${i}`);
              console.log("Les modifications ont été appliquées pour le réseau.");
              break;
            }
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
    }

    return true;
  }



}
