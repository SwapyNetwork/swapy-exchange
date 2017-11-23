import { Component, OnInit } from '@angular/core';
import { InvestService } from './invest.service';
import { Router } from '@angular/router';
import { Invest } from './invest.interface';
import { SuccessfulInvestmentService } from './../successful-investment/successful-investment.service';
import { InvestorComponent } from './../investor.component';
import { WalletService } from '../../common/services/wallet.service';
import { InvestmentAssetProtocolService as AssetService } from '../../common/services/protocol/investment-asset.service';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css']
})
export class InvestComponent implements OnInit {

  public investment;
  public offerIndex: number;
  public wallet: any;

  constructor(private investService: InvestService, private router: Router,
    private successfulInvestmentService: SuccessfulInvestmentService,
    private investorComponent: InvestorComponent, private walletService: WalletService,
    private assetService: AssetService) {
    this.wallet = this.walletService.getWallet();
  }

  ngOnInit() {
    this.investment = this.investService.getCachedInvestment();
    console.log(this.investment);
    if (!this.investment) {
      this.router.navigate(['/investor/offers']);
    }
    this.offerIndex = this.investService.getCachedOfferIndex();
  }

  confirmInvestment() {
    this.successfulInvestmentService.cleanMessages();

    for (const asset of this.investment.assets) {
      this.assetService.invest(asset.contractAddress, asset.value,
        '67e49469e62a9805e43744ec4437a6dcf6c6bc36d6a33be837e95b8d325816ed', (success) => {
          console.log(success);
        }, (error) => {
          console.error(error);
        });
    }
  }

}
