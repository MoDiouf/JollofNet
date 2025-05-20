import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. Check if session exists
    if (!req.session) {
      return res.status(401).json({ message: 'Session not initialized' });
    }

    // 2. Initialize user object if doesn't exist
    if (!req.session.user) {
      req.session.user = { 
        id: 0, 
        session: '', 
        name: '', 
        modemUsername: "", 
        modemPassword: "" 
      };
      return res.redirect('/signuplogin'); // Redirect to login if no user session
    }

    // 3. Validate required fields
    if (!req.session.user.id || !req.session.user.session) {
      return res.status(401).json({ message: 'Invalid session data' });
    }

    // 4. Attach user to request
    req.user = {
      id: req.session.user.id,
      session: req.session.user.session
    };

    next();
  }
}