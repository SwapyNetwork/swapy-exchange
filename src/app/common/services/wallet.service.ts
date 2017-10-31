import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { StorageService } from './storage.service';
import { ErrorLogService } from './error-log.service';

import { Wallet } from '../interfaces/wallet.interface';

import { ElectronService } from 'ngx-electron';

@Injectable()
export class WalletService {

  private web3;
  private wallet: Wallet;
  constructor(private web3Service: Web3Service,
    private electronService: ElectronService,
    private errorLogService: ErrorLogService,
    public storageService: StorageService) {

    this.electronService.ipcRenderer.on('create-wallet-error', (event, err) => {
      // Error handling if the wallet creation fails;
      console.log(err);
    });
  }

  public createWallet() {
    this.web3 = this.web3Service.getInstance();
    const account = this.web3.eth.accounts.create();
    this.wallet = {
      address: account.address,
      privateKey: account.privateKey,
    };

    const wallet = {
      address: account.address,
      privateKey: account.privateKey,
      user: this.getUserIdentification()
    };

    // Save keys to local file
    this.electronService.ipcRenderer.send('create-wallet', wallet);
  }

  getWallet() {
    if (!this.wallet) {
      return this.electronService.ipcRenderer.sendSync('get-wallet', this.getUserIdentification());
    }
    return this.wallet;
  }

  getUserIdentification() {
    // @todo Maybe change the way we identify a wallet. Currently it is the email without special chars.
    return this.storageService.getItem('user').email.replace(/[^a-zA-Z0-9]/g, '');
  }

  delete() {
    this.wallet = null;
  }

  getBalance() {
    return this.web3Service.getInstance().eth.getBalance(this.getWallet().address);
  }

  getEthBalance() {
    return new Promise((resolve, reject) => {
      this.getBalance().then((balance) => {
        const ethBalance = this.web3Service.getInstance().utils.fromWei(balance, 'ether');
        resolve(ethBalance);
      }, (error) => {
        this.errorLogService.setClassName('WalletService');
        this.errorLogService.setFunctionName('getEthBalance');
        this.errorLogService.setError(error);
        reject(error);
      })
    });
  }

}
