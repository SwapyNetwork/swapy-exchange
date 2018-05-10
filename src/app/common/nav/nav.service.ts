import { Injectable } from '@angular/core';
import { Web3Service } from '../services/web3.service';
import { WalletService } from '../services/wallet.service';
import { StorageService } from '../services/storage.service';

@Injectable()
export class NavService {

  private notifications;
  private walletAddress;
  private userType;

  constructor(
    protected walletService: WalletService,
    private web3Service: Web3Service,
    private storageService: StorageService
  ) {
    this.walletAddress = this.walletService.getWallet().address;
    this.userType = this.storageService.getItem('user').type;
  }

  public async getTransactionStatus() {
    const transactionsHashes = this.storageService.getItem('notifications')[this.walletAddress][this.userType] || {};
    let status;
    let receipt;
    let notifications = [];
    for (const key in transactionsHashes) {
      receipt = await this.web3Service.getInstance().eth.getTransactionReceipt(key);
      if (receipt == null) {
        notifications.push({
          date: transactionsHashes[key],
          status: 0
        });
      } else {
        status = Number(receipt.status);
        notifications.push({
          date: transactionsHashes[key],
          status: status === 0 ? -1 : 1
        });
      }
    }

    notifications = notifications.sort((a, b) => b.date - a.date);

    this.setNotifications(notifications);
  }

  public setNotifications(notifications) {
    this.notifications = notifications;
  }

  public getNotifications() {
    return this.notifications;
  }

}
