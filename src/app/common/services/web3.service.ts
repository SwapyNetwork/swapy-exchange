import { Injectable } from '@angular/core';
import Web3 from 'web3';

import * as ProviderFile from '../../../../env.json';

@Injectable()
export class Web3Service {

  private web3Ws: Web3;
  private web3Http: Web3;
  constructor() { }

  public init() {
    if ((<any>ProviderFile).ENV === 'test' && this.web3Ws == null) {
      this.web3Http = new Web3(new Web3.providers.HttpProvider((<any>ProviderFile).TEST_RPC_PROVIDER));
    } else if (this.web3Ws == null) {
      this.web3Ws = new Web3(new Web3.providers.WebsocketProvider((<any>ProviderFile).WS_PROVIDER));
      this.web3Http = new Web3(new Web3.providers.HttpProvider((<any>ProviderFile).HTTP_PROVIDER));
    }
  }

  private isOpen(connection) {
    return connection.readyState === connection.OPEN;
  }

  public getInstance() {
    if (this.web3Ws == null && this.web3Http == null) {
      this.init();
    }

    if (this.web3Ws && this.isOpen(this.web3Ws.currentProvider.connection)) {
      return this.web3Ws;
    }
    return this.web3Http;
  }
}
