import { SharedService } from 'src/shared/shared.service';
import { AddNetworkService } from './add-network.service';
import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('app/addNetwork')
export class AddNetworkController {
  constructor(
    private readonly addNetworkService: AddNetworkService,
    private readonly sharedService: SharedService,
  ) {}

  @Get()
  async getAddNetwork(@Req() req: Request, @Res() res: Response) {
    const user = req.session.user;
    if (!user || !user.session) {
      return res.redirect('/signuplogin');  // Redirige vers la page de connexion si la session est invalide
    }
    console.log(req.session.user)
    
    const name = req.session.user.name;
    const capitalizedname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let modemData = this.sharedService.getModemData();
    if (!modemData) {
      modemData = await this.fetchModemData(req.session.user.id, req);
    }
    
    if (modemData == null) {
      return res.render('user/dashboard', {
        title: 'Ajouter un réseau',
        content: 'addNetwork',
        name: capitalizedname,
        modemData,
        message: 'Connexion lente, actualiser ultérieurement',
        messageType: 'error',
      });
    }
    return res.render('user/dashboard', {
      title: 'Ajouter un réseau',
      content: 'addNetwork',
      name: capitalizedname,
      modemData,
      message: null,
      messageType: null,
    });
  }

  @Post()
  async AddModem(@Req() req:Request ,@Body() body:any,@Res() res:Response){
    const idUser = req.session.user.id
    const {username, password} = body
    console.log(username,password);
    const name = req.session.user.name;
    const capitalizedname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const data = await this.addNetworkService.AddModem(username,password,idUser)
    //const UpdateNetwork = this.addNetworkService.UpdateNetworks(idUser)
    const modem = {
      modem_username: username,
      modem_mot_de_passe: password,
    };
    this.addNetworkService.fastUpdateModem(modem)
    req.session.user.modemUsername = username
    req.session.user.modemPassword = password
    if (data) {
      return res.render('user/dashboard', {
        content: 'addNetwork', 
        title: 'Reseau',
        name:capitalizedname ,
        data:null,
        message: 'success',
        messageType:'Votre modem a été ajouté avec succes',
      });
    }else{
      return res.render('user/dashboard', {
        content: 'addNetwork', 
        title: 'Reseau',
        name:capitalizedname ,
        data:null,
        message: 'error',
        messageType:"Une erreur s'est produit lors de l'ajout",
      });
    }
  }


  private async fetchModemData(IdUser: any,req:Request) {
    try {
      const modem = await this.addNetworkService.SearchIfModem(IdUser);
      if (!modem) {
        console.log('Aucun modem trouvé pour cet utilisateur.');
        return false; 
      }
      const data = await this.addNetworkService.processModemWithTimeout(modem);
      req.session.user.modemUsername = modem.modem_username
      req.session.user.modemPassword = modem.modem_mot_de_passe
      if (data =='long') {
        return null
      }
      console.log(data);
      
      this.sharedService.setModemData(data);
    const existingNetworks = await this.addNetworkService.checkNetworksExist(modem.id);
    if (!existingNetworks) {
      console.log('Nouveaux enregistrements....');
      this.saveNetworksInBackground(modem.id, data);
    } else {
      console.log('Réseaux déjà sauvegardés, aucune action nécessaire.');
    }
      return data;
    } catch (error) {
      console.error('Erreur lors du traitement du modem:', error);
      return null;
    }
  }

  private async saveNetworksInBackground(modemId: number, networks: any) {
    setImmediate(async () => {
      try {
        await this.addNetworkService.saveNetworks(modemId, networks);
        console.log('Réseaux sauvegardés en tâche de fond.');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des réseaux:', error);
      }
    });
  }
}
