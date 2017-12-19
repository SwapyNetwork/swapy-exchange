import { Injectable } from '@angular/core';
import { UportService } from './uport.service';
import Web3 from 'web3';

import * as ProviderFile from '../../../../env.json';

@Injectable()
export class Web3Service {

  private web3Ws: Web3;
  constructor(private uportService: UportService) {
  }

  private isOpen(connection) {
    return connection.readyState === connection.OPEN;
  }

  public getInstance(uPort) {
    return uPort ? this.uportService.getWeb3() : (window as any).web3;
  }

  public getWSInstance() {
    if (this.web3Ws && this.isOpen(this.web3Ws.currentProvider.connection)) {
      return this.web3Ws;
    }
    return (window as any).web3;
  }
}
