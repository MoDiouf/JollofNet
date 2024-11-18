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
  @Render('user/dashboard')
  async getAddNetwork(@Req() req: Request, @Res() res: Response) {
    const name = req.session.user.name;
    const capitalizedname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let modemData = this.sharedService.getModemData();
    if (!modemData) {
      modemData = await this.fetchModemData(req.session.user.id, req);
    }
    
    const immediateResponse = { 
      title: 'Ajouter un réseau', 
      content: 'addNetwork', 
      name: capitalizedname,
      modemData,
      message: null,
      messageType: null, 
    };
    return immediateResponse;
  }

  @Post()
  async AddModem(@Req() req:Request ,@Body() body:any,@Res() res:Response){
    const idUser = req.session.user.id
    const {username, password} = body
    console.log(username,password);
    const name = req.session.user.name;
    const capitalizedname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const data = this.addNetworkService.AddModem(username,password,idUser)
  
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
      const data = await this.addNetworkService.processModem(modem);
      req.session.user.modemUsername = modem.modem_username
      req.session.user.modemPassword = modem.modem_mot_de_passe
      console.log(data);
      
      this.sharedService.setModemData(data);
      return data;
    } catch (error) {
      console.error('Erreur lors du traitement du modem:', error);
      return null;
    }
  }

  
}
