import { Injectable } from '@angular/core';
import Web3 from 'web3';

import * as ProviderFile from '../../../../env.json';

@Injectable()
export class Web3Service {

  private web3: Web3;
  private web3Http: Web3;
  constructor() { }

  public init() {
    if (this.web3 == null) {
      this.web3 = new Web3(new Web3.providers.WebsocketProvider((<any>ProviderFile).wsProvider));
      this.web3Http = new Web3(new Web3.providers.HttpProvider((<any>ProviderFile).provider));
    }
  }

  private isOpen(connection) {
    return connection.readyState === connection.OPEN;
  }

  public getInstance() {
    if (this.web3 == null) {
      this.init();
    }

    if (this.isOpen(this.web3.currentProvider.connection)) {
      return this.web3;
    }
    return this.web3Http;
  }
}
