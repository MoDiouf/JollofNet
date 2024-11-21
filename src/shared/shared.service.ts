import { Injectable } from '@nestjs/common';
import {Network} from './../add-network/interfaces/network.interface'
@Injectable()
export class SharedService {
  private modemData: any;
  private sessionId: any;
  private UserId: number;

  setModemData(data: any) {
    this.modemData = data;
  }
  setSessionId(IdSessionUser: string) {

    this.sessionId = IdSessionUser;
    console.log('UserSession in Shared Before',this.sessionId)
  }
  setUserId(IdUser: number) {

    this.UserId = IdUser;
    console.log('User in Shared after',this.UserId);
  }

  getModemData() {
    return this.modemData;
  }

  getSessionId() {
    return this.sessionId;
  }

  getUserId() {
    return this.UserId;
  }
}
