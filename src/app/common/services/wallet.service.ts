import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { StorageService } from './storage.service';
import { ErrorLogService } from './error-log.service';

import { Wallet } from '../interfaces/wallet.interface';

import * as ProviderFile from '../../../../env.json';

@Injectable()
export class WalletService {

  private web3;
  private wallet: Wallet = {} as Wallet;
  constructor(private web3Service: Web3Service,
    private errorLogService: ErrorLogService,
    public storageService: StorageService) {}

  public async getCurrentAccount() {
    const accounts = await this.web3Service.getInstance().eth.getAccounts();
    this.wallet.address = accounts[0];
    return this.wallet;
  }

  getWallet() {
    return this.wallet;
  }

  getUserIdentification() {
    // @todo Maybe change the way we identify a wallet. Currently it is the email without special chars.
    return this.storageService.getItem('user');
  }

  delete() {
    this.wallet = null;
  }

  async getBalance() {
    const account = await this.getCurrentAccount();
    return this.web3Service.getInstance().eth.getBalance(account.address);
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
