import { Component, OnInit } from '@angular/core';
import { InvestService } from './invest.service';
import { Router } from '@angular/router';
import { Invest } from './invest.interface';
import { SuccessfulInvestmentService } from './../successful-investment/successful-investment.service';
import { InvestorComponent } from './../investor.component';
import { WalletService } from '../../common/services/wallet.service';
import { ToastrService } from '../../common/services/toastr.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { MessageService } from '../../common/message/message.service';

import * as sha1 from 'sha1';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css']
})
export class InvestComponent implements OnInit {

  public investment;
  public offerIndex: number;
  public wallet: any;
  private assetIndex: number;

  constructor(
    private investService: InvestService,
    private router: Router,
    private investorComponent: InvestorComponent,
    private messageService: MessageService,
    private walletService: WalletService,
    private toastrService: ToastrService,
    private swapyProtocol: SwapyProtocol
  ) {
    this.wallet = this.walletService.getWallet();
  }

  ngOnInit() {
    this.investment = this.investService.getCachedInvestment();
    if (!this.investment) {
      this.router.navigate(['/investor/offers']);
    }
    this.assetIndex = 0;
    this.offerIndex = this.investService.getCachedOfferIndex();
  }

  collateralToString(index) {
    const token = this.investment.assets[index].token;
    if (token > 0) {
      return `Collateral ${token} SWAPY`;
    }
    return 'No collateral;'
  }

  private onError(error) {
    this.toastrService.error(error.message);
    this.messageService.setErrorMessage(error.message);
  }

  async invest() {
    this.router.navigate(['/investor/message']);
    try {
      const assetsAddress = this.investment.assets.map(asset => asset.contractAddress);
      const assetsValues = this.investment.assets.map(asset => asset.value);
      await this.swapyProtocol.invest(assetsAddress, assetsValues);
      this.toastrService.getInstance().success('Your investment was mined by the Ethereum blockchain!');
      this.messageService.setLastMessage('Your investment was mined by the Ethereum blockchain!');
      this.messageService.setHeaderMessage('Transaction confirmed');
    } catch (error) {
      this.onError(error);
    }
  }
}
