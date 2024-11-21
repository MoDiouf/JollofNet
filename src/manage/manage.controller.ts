import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request,Response } from 'express';
import { SharedService } from 'src/shared/shared.service';
import { ManageService } from './manage.service';
import { CreateWifiDto } from './DTO/create-wifi.dto';

@Controller('app/manage')
export class ManageController {
  constructor(
    private readonly sharedService: SharedService,
    private readonly manageService:ManageService
  ) {}

  @Get()
  @Render('user/dashboard')
  async getManage(@Req() req:Request) {

    const data = this.sharedService.getModemData();
    const name = req.session.user.name;
    const capitalizedname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  
    if (!data) {
      console.log('Pas de données disponibles');
      return { 
        message: null, 
        messageType: null, // Ajouter un type de message
        title: 'Réseau', 
        content: 'manageNetworks', 
        data: null,
        name: capitalizedname 
      };
    }
  

    
    return { 
     title: 'Réseau',
     content: 'manageNetworks',
     data:data,
     name:capitalizedname,
     message: null, 
     messageType: null,
     };
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
    const data2_4GHz = data.slice(0, 3);  // Les trois premiers éléments pour 2.4 GHz
    const data5GHz = data.slice(3,6);
  const selectedData = createWifiDto.networkFrequency === '2.4' ? data2_4GHz : data5GHz;
    console.log(data2_4GHz);
    
  const  disabledNetwork =  selectedData.find(network => network.enableChecked === false);

  
  if (disabledNetwork) {
    console.log('Réseau désactivé trouvé:', disabledNetwork);
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
    
    console.log(networkDelete);
    
  }


}  
