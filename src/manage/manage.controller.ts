import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request,Response } from 'express';
import { SharedService } from 'src/shared/shared.service';
import { ManageService } from './manage.service';
import { CreateWifiDto } from './DTO/create-wifi.dto';
import { log } from 'console';

@Controller('app/manage')
export class ManageController {
  constructor(
    private readonly sharedService: SharedService,
    private readonly manageService:ManageService
  ) {}

  @Get()
  async getManage(@Req() req:Request, @Res() res:Response) {
    const user = req.session.user
    const data = this.sharedService.getModemData();
    const name = req.session.user.name;
    const capitalizedname = name.charAt(0).toUpperCase() + name.slice(1).toUpperCase();
    
    if (!user || !user.session) {
      return res.redirect('/signuplogin');  // Redirige vers la page de connexion si la session est invalide
    }
    if (!data) {
      console.log('Pas de données disponibles');
      return res.render('user/dashboard',{ 
        message: 'success', 
        messageType: 'Actualiser la page', // Ajouter un type de message
        title: 'Réseau', 
        content: 'manageNetworks', 
        data: null,
        name: capitalizedname 
      });
    }
    const dataFromDB = await this.manageService.AllData(user.id)
console.log("GetManage",data);

    
    return res.render('user/dashboard', { 
     title: 'Réseau',
     content: 'manageNetworks',
     data:data,
     name:capitalizedname,
     message: null, 
     messageType: null,
     });
  }

  
  @Post()
  async changePassword(
    @Body('network') network: string,
    @Body('newpassword') newPassword: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    console.log('Réseau sélectionné:', network);
    console.log('Nouveau mot de passe:', newPassword);
  
    const modemUser = req.session.user.modemUsername;
    const modemPass = req.session.user.modemPassword;
    const userID  = req.session.user.id
    const change = await this.manageService.changePassword(network, newPassword, modemUser, modemPass,userID);
  
    console.log("Résultat de l'opération de changement de mot de passe:", change);
  
    // Définir les messages en fonction du résultat
    if (change) {
      res.locals.message = "Mot de passe changé avec succès";
      res.locals.messageType = "success";
    } else {
      res.locals.message = "Échec du changement de mot de passe";
      res.locals.messageType = "error";
    }
    const data = this.sharedService.getModemData();
    const name = req.session.user.name;
    const capitalizedname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return res.render('user/dashboard', {
      content: 'manageNetworks', 
      title: 'Reseau',
      name:capitalizedname ,
      data:data,
      message: res.locals.message,
      messageType: res.locals.messageType,
    });
  
  }
  
  @Post('newWifi')
  async createNewWifi(@Body() createWifiDto: CreateWifiDto,@Req() req:Request,@Res() res:Response) {
    const data = this.sharedService.getModemData();
    const name = req.session.user.name;
    const userId = req.session.user.id
    const modemUsername = req.session.user.modemUsername
    const modemPassword = req.session.user.modemPassword
    const capitalizedname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();


    const data2_4GHz = data.filter(network => network.frequency === '2.4GHz');
    const data5GHz = data.filter(network => network.frequency === '5GHz');
    const selectedData = createWifiDto.networkFrequency === '2.4' ? data2_4GHz : data5GHz;

    
  const  disabledNetwork =  selectedData.find(network => network.enableChecked === false);

  if (disabledNetwork) {
    //console.log('Réseau désactivé trouvé:', disabledNetwork);
    const AddNewNet = await this.manageService.CreateNewWifi(createWifiDto,modemUsername,modemPassword,userId);
    if (AddNewNet) {
      return res.status(200).render('user/dashboard', {
        content: 'manageNetworks', 
        title: 'Reseau',
        name:capitalizedname ,
        data:data,
        message: 'Réseau creer avec succées',
        messageType: 'success',
      });
    }else{
      return res.status(400).render('user/dashboard', {
        content: 'manageNetworks', 
        title: 'Reseau',
        name:capitalizedname ,
        data:data,
        message: 'Verifier les informations soumises',
        messageType: 'error',
      });
    }
  }else{
    console.log("Reseau avec cette frequence saturé");
    res.status(400).render('user/dashboard', {
      content: 'manageNetworks', 
      title: 'Reseau',
      name:capitalizedname ,
      data:data,
      message: 'Frequence Saturé',
      messageType: 'error',
    });
  }
  
    
  }

  @Post('deleteWifi')
  async deleteWifi(@Body('networkDelete') networkDelete: string, @Req() req: Request, @Res() res: Response){
    
    const username = req.session.user.modemUsername
    const password = req.session.user.modemPassword
    console.log(networkDelete);
    const userID  = req.session.user.id
    const name = req.session.user.name;
    const capitalizedname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const data  = await this.manageService.deleteWifi(networkDelete,username,password,userID)
    //console.log(data);
    const dataModem = this.sharedService.getModemData();
    if (data) {
      return res.status(200).render('user/dashboard', {
      content: 'manageNetworks', 
      title: 'Reseau',
      name:capitalizedname ,
      data:dataModem,
      message: 'Réseau supprimé avec succes',
      messageType: 'success',
    })  
  }
  else{
    return res.status(200).render('user/dashboard', {
      content: 'manageNetworks', 
      title: 'Reseau',
      name:capitalizedname ,
      data:dataModem,
      message: "Une erreur s'est produite reessayer" ,
      messageType: 'error',
    })  
  }
  }

  @Post('refresh')
async refreshModem(@Req() req: Request, @Res() res: Response) {
  const user = req.session.user;
    console.log("Refresh",user);
    
    
  try {
    const idUser = req.session.user.id;
    const dataModem = await this.manageService.getDataModem(idUser);
    const modem = {
      modem_username: dataModem.modem_username,
      modem_mot_de_passe: dataModem.modem_mot_de_passe,
    };

    const result = await this.manageService.refreshModem(modem);
    console.log("RefreshGet",result);
    
    this.sharedService.setModemData(result);

    if (result) {
      return res.redirect('/app/manage'); // Redirection côté serveur
    } else {
      return res.status(200).json({
        success: false,
        message: "Échec lors de la récupération des réseaux.",
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'actualisation du modem :", error);
    return res.status(500).json({
      success: false,
      message: "Une erreur interne est survenue.",
    });
  }
}

@Post("generate")
async generateQrCode(@Req() req: Request){
  const userId = req.session.user.id

  const generate = await this.manageService.generateQrCodes(userId)
}
  @Post("DeleteModem")
  async removeModem(@Req() req:Request,@Res() res: Response){
    const userId = req.session.user.id
    try {
      const result = await this.manageService.deleteDataModem(userId);
      if (result) {
        return res.json({
          success: true,
          message: 'Le modem a été supprimé avec succès.',
        });
      } else {
        return res.json({
          success: false,
          message: 'Aucune donnée n\'a été supprimée.',
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la suppression.',
      });
    }

  }
}  

