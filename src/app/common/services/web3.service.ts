import { Injectable } from '@angular/core';
import Web3 from 'web3';

import * as ProviderFile from '../../../../provider.json';

@Injectable()
export class Web3Service {

  private web3: Web3;
  constructor() { }

  public init() {
    this.web3 = new Web3(new Web3.providers.HttpProvider((<any>ProviderFile).provider));
  }

  public getInstance() {
    return this.web3;
  }

}
