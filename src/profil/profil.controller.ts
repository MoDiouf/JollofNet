import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProfilService } from './profil.service';

@Controller('app/profil')
export class ProfilController {
  constructor(private readonly profilService: ProfilService) {}
  @Get()
  @Render('user/dashboard')
  async getAddProfil(@Req() req: Request) {
    //const data = this.sharedService.getModemData();
    const name = req.session.user.name;
    const id = req.session.user.id;
    const capitalizedname =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const user = await this.profilService.getUserData(id);

    return {
      title: 'Profil',
      content: 'profil',
      data: user,
      name: capitalizedname,
      message: null,
      messageType: null,
    };
  }

  @Post('updateUser')
  async updateUser(@Req() req: Request,@Body('updateUser') body: any,@Res() res: Response,
  ) {
    const name = req.session.user.name;
    const id = req.session.user.id;
    const capitalizedname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const resultat = await this.profilService.updateUser(id,body)
    if (resultat) {
      return res.status(200).render('user/dashboard', {
      content: 'profil',
      title: 'profil',
      name: capitalizedname,
      data: body,
      message: 'Mise à jour reussi',
      messageType: 'success',
    });
    }else{
      return res.status(200).render('user/dashboard', {
        content: 'profil',
        title: 'profil',
        name: capitalizedname,
        data: body,
        message: 'Erreur lors de la mise à jour',
        messageType: 'error',
      });
    }

    
  }
}
