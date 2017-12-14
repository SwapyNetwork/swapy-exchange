import { Injectable } from '@angular/core';
import Web3 from 'web3';

import * as ProviderFile from '../../../../env.json';

@Injectable()
export class Web3Service {

  private web3Ws: Web3;
  constructor() {
    this.init();
  }

  public init() {
    // if (this.web3Ws == null) {
    //   this.web3Ws = new Web3(new Web3.providers.WebsocketProvider((<any>ProviderFile).WS_PROVIDER));
    // }
  }

  private isOpen(connection) {
    return connection.readyState === connection.OPEN;
  }

  public getInstance() {
    return (window as any).web3
  }

  public getWSInstance() {
    if (this.web3Ws == null) {
      this.init();
    }

    if (this.web3Ws && this.isOpen(this.web3Ws.currentProvider.connection)) {
      return this.web3Ws;
    }
    return (window as any).web3;
  }
}
