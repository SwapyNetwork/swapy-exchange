import { Injectable } from '@angular/core';
import Web3 from 'web3';

import * as ProviderFile from '../../../../env.json';

@Injectable()
export class Web3Service {

  private web3: Web3;
  constructor() { }

  public init() {
    this.web3 = new Web3(new Web3.providers.HttpProvider((<any>ProviderFile).provider));
  }

  public getInstance() {
    if (this.web3 == null) {
      this.init();
    }
    return this.web3;
  }

}
