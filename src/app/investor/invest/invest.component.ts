import { Component, OnInit } from '@angular/core';
import { InvestService } from './invest.service';
import { Router } from '@angular/router';
import { Invest } from './invest.interface';
import { SuccessfulInvestmentService } from './../successful-investment/successful-investment.service';
import { InvestorComponent } from './../investor.component';
import { WalletService } from '../../common/services/wallet.service';
import { ToastrService } from '../../common/services/toastr.service';
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
  private assetIndex: number;

  constructor(private investService: InvestService, private router: Router,
    private successfulInvestmentService: SuccessfulInvestmentService,
    private investorComponent: InvestorComponent, private walletService: WalletService,
    private assetService: AssetService, private toastrService: ToastrService) {
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

  confirmInvestment() {
    this.successfulInvestmentService.cleanMessages();
    this.invest();
    this.router.navigate(['investor/invest/success']);
  }

  invest() {
    const asset = this.investment.assets[this.assetIndex];
    this.assetService.invest(asset.contractAddress, asset.value,
      '67e49469e62a9805e43744ec4437a6dcf6c6bc36d6a33be837e95b8d325816ed', (success) => {
        this.toastrService.getInstance().success('Your investment was mined by the Ethereum blockchain.');
        this.successfulInvestmentService.setMessage('Your investment was mined by the Ethereum blockchain.');

        if (this.assetIndex < this.investment.assets.length - 1) {
          this.assetIndex++;
          this.invest();
        }
      }, (error) => {
        this.successfulInvestmentService.setErrorMessage(error.message);
        this.toastrService.getInstance().error(this.successfulInvestmentService.getMessage());

        if (this.assetIndex < this.investment.assets.length - 1) {
          this.assetIndex++;
          this.invest();
        }
      });


  }

}
