import { Injectable } from '@angular/core';
import { Connect, SimpleSigner } from 'uport-connect';

const UPORT_CLIENT_ID = require('../../../../env.json').UPORT_CLIENT_ID;
const UPORT_KEY = require('../../../../env.json').UPORT_KEY;

@Injectable()
export class UportService {

  private uport: any;

  constructor() {
    this.uport = new Connect('SwapyExchange', {
        clientId: UPORT_CLIENT_ID,
        network: 'rinkeby',
        signer: SimpleSigner(UPORT_KEY)
    })
  }

  public getUport() {
    return this.uport;
  }

  public getWeb3() {
    return this.uport.getWeb3();
  }

}
