import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { StorageService } from './storage.service';
import { LogoutService } from './logout.service';
import { ErrorLogService } from './error-log.service';

import { Wallet } from '../interfaces/wallet.interface';

import * as env from '../../../../env.json';

@Injectable()
export class WalletService {

  private web3;
  private wallet: Wallet = {} as Wallet;
  private lastAddress: string;
  constructor(private web3Service: Web3Service,
    private errorLogService: ErrorLogService,
    private logoutService: LogoutService,
    public storageService: StorageService) {}

  public async getCurrentAccount() {
    this.lastAddress = this.wallet.address || undefined;
    const accounts = await this.web3Service.getInstance().eth.getAccounts();
    this.wallet.network = this.getCurrentNetwork();
    this.wallet.address = accounts[0];
    return this.wallet;
  }

  public getCurrentNetwork() {
    if (this.web3Service.getInstance().eth.currentProvider.publicConfigStore) {
      return this.web3Service.getInstance().eth.currentProvider.publicConfigStore._state.networkVersion;
    } else {
      return false;
    }
  }

  public listenForAccountChanges() {
    setInterval(async () => {
      const account = await this.getCurrentAccount();
      if (!account || account.address === undefined ||
        (account.address !== this.lastAddress && this.lastAddress !== undefined) ||
        (Number(account.network) !== Number((env as any).NETWORK_ID) && (env as any).ENV !== 'dev')) {
        this.logoutService.logout();
      }
    }, 1000);
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
