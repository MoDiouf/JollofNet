import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        req.session.user = { id: 0, session: '',name:'',modemUsername:"",modemPassword:"" };  // Initialise req.session.user si non défini
    }

    const userSession = req.session.user ? req.session.user : null;

    if (userSession) {
        req.user = { id: userSession.id, session: userSession.session };
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

}
