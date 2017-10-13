import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';

@Injectable()
export class InvestmentAssetService {
  private web3;
  private wallet;
  private contract;

  constructor(private web3Service: Web3Service, private walletService: WalletService) {
    this.web3 = this.web3Service.getInstance();
    this.wallet = this.walletService.getWallet();
  }

}
