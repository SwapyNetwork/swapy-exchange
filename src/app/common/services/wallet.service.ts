import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

import { Wallet } from '../interfaces/wallet.interface';

import { ElectronService } from 'ngx-electron';

@Injectable()
export class WalletService {

  private web3;
  private wallet: Wallet;
  constructor(private web3Service: Web3Service, private electronService: ElectronService) {

    this.electronService.ipcRenderer.on('create-wallet-error', (event, err) => {
      // Error handling if the wallet creation fails;
      console.log(err);
    });
  }

  createWallet() {
    this.web3 = this.web3Service.getInstance();
    const account = this.web3.eth.accounts.create();
    this.wallet = {
      address: account.address,
      privateKey: account.privateKey,
    };

    // Save keys to local file
    this.electronService.ipcRenderer.send('create-wallet', this.wallet);
  }

  getWallet() {
    if (!this.wallet) {
      return this.electronService.ipcRenderer.sendSync('get-wallet');
    }
    return this.wallet;
  }
}
