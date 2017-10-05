import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

@Injectable()
export class WalletService {

  private web3;
  constructor(private web3Service: Web3Service) { }

  createAccount() {
    this.web3 = this.web3Service.getInstance();
    const account = this.web3.eth.accounts.create();

    // Save to local file (preferably with electron-store)
    
  }

}
