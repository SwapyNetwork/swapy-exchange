import { Injectable } from '@angular/core';
import { Web3Service } from '../services/web3.service';
import { StorageService } from '../services/storage.service';

@Injectable()
export class NavService {

  constructor(
    private web3Service: Web3Service,
    private storageService: StorageService
  ) { }

  public async getTransactionStatus() {
    const transactionsHashes = this.storageService.getItem('notifications') || {};
    console.log(transactionsHashes);
    let status;
    let receipt;
    const notifications = [];
    for (const key in transactionsHashes) {
      receipt = await this.web3Service.getInstance().eth.getTransactionReceipt(key);
      if (receipt == null) {
        notifications.push({transactionHash: 0});
      } else {
        status = Number(receipt.status);
        notifications.push({transactionHash: status == 0 ? -1 : 1});
      }
    }

    console.log(notifications);

  }

}
