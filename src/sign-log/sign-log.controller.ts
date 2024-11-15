import { SignLogService } from './sign-log.service';
import { Response, Request } from 'express';
import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { SharedService } from 'src/shared/shared.service';

@Controller('signuplogin')
export class SignLogController {
  constructor(
    private readonly signLogService: SignLogService,
    private readonly shared: SharedService,
  ) {}

  @Get()
  @Render('signLog/signLog.ejs')
  signLog() {}

  @Post('/login')
  async ConnectUser(
    @Body() body: any,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<string | any> {
    const { email, password } = body;

    try {
      const user = await this.signLogService.SearchUser(email, password);

      if (user !== null) {
        req.session.user = {
          id: user.id,
          session: req.sessionID,
          name: user.username,
          modemUsername:'',
          modemPassword:''
        };
        return res.status(200).redirect('/app/addNetwork');
      } else {
        // Utilisation de res.locals pour passer l'erreur à la vue
        res.locals.errorMessage = 'Vérifiez vos informations de connexion.';
        return res.status(401).render('signLog/signLog.ejs');
      }
    } catch (error) {
      // Utilisation de res.locals pour passer l'erreur à la vue
      res.locals.errorMessage = 'Une erreur est survenue lors de la connexion.';
      console.error('Login error:', error);
      return res.status(500).render('signLog/signLog.ejs');
    }
  }

  @Post('/create')
async createUser(
  @Body() body: any,
  @Res() res: Response,
  @Req() req: Request,
) {
  const { name, email, password } = body;

  try {
    const user = await this.signLogService.AddUser(name, email, password);
    if (user) {
      req.session.user = {
        id: user.id,
        session: req.sessionID,
        name: user.username,
        modemUsername:'',
        modemPassword:''
      };
      return res.status(200).redirect('/app/addNetwork');
    }
  } catch (error) {
    if (error.message.includes('email ou nom d\'utilisateur existe déjà')) {
      res.locals.errorMessage = "Email ou nom d'utilisateur déjà utilisé.";
      return res.status(400).render('signLog/signLog.ejs'); 
    } else {
      res.locals.errorMessage = "Une erreur est survenue lors de l'inscription.";
      return res.status(500).render('signLog/signLog.ejs');
    }
  }
}

}
