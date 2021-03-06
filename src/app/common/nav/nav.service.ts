import { Injectable } from '@angular/core';
import { Web3Service } from '../services/web3.service';
import { WalletService } from '../services/wallet.service';
import { LoadingService } from '../services/loading.service';
import { StorageService } from '../services/storage.service';

@Injectable()
export class NavService {

  private notifications = [];
  private walletAddress;
  private userType;
  private newNotification;

  constructor(
    protected walletService: WalletService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private storageService: StorageService
  ) {
  }

  public async getTransactionStatus() {
    this.loadingService.show();
    this.walletAddress = this.walletService.getWallet().address;
    this.userType = this.storageService.getItem('user').type;
    const storagedHashes = this.storageService.getItem('notifications') || {};
    if (storagedHashes[this.walletAddress] !== undefined && storagedHashes[this.walletAddress][this.userType] !== undefined) {

      const transactionsHashes = storagedHashes[this.walletAddress][this.userType];
      let status;
      let receipt;
      let block;
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
          block = await this.web3Service.getInstance().eth.getBlock(receipt.blockNumber);
          notifications.push({
            date: block.timestamp * 1000,
            status: status === 0 ? -1 : 1
          });
        }
      }

      notifications = notifications.sort((a, b) => b.date - a.date);

      this.newNotification = false;

      this.setNotifications(notifications);
    } else {
      this.setNotifications([]);
    }
    this.loadingService.hide();
  }

  public setNotifications(notifications) {
    this.notifications = notifications;
  }

  public getNotifications() {
    return this.notifications;
  }

  public setNewNotificationFlag() {
    this.newNotification = true;
  }

  public getNotificationFlag() {
    return this.newNotification;
  }

}
