import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

import { Wallet } from '../interfaces/wallet.interface';

@Injectable()
export class WalletService {

  private web3;
  private wallet: Wallet;
  constructor(private web3Service: Web3Service) { }

  public createWallet() {
    this.web3 = this.web3Service.getInstance();
    const account = this.web3.eth.accounts.create();
    // When not using electron-store
    this.wallet = {
      address: account.address,
      privateKey: account.privateKey,
    };

    // Save keys to local file (preferably with electron-store)

  }

  public getWallet() {
    // Get keys from local file (preferably with electron-store)
    return this.wallet;
  }

}
