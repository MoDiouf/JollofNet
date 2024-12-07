import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth-google')
export class AuthGoogleController {
  
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirection vers Google
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res: Response) {
    try {
      const user = req.user;

      if (user) {
        //console.log('Utilisateur authentifié avec succès:', user);
        req.session.user = {
            id: user.id,
            session: req.sessionID,
            name: user.username,
            modemUsername:'',
            modemPassword:''
          };
        return res.redirect('/app/addNetwork');
      }

      // Redirection en cas d'erreur
      return res.redirect('/signuplogin');
    } catch (error) {
      console.error('Erreur lors de la redirection après authentification Google:', error);
      return res.redirect('/login');
    }
  }
}
