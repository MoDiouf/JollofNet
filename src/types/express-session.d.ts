// src/types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: { id: number; session: string; name:string;modemUsername:string;modemPassword:string };
    pendingClientData?: {
      userModem: string;
      passModem: string;
      macAddress: string;
      nom:string;
      essid:string;
    };
  }
  
}
