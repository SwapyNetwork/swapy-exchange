import { Component, OnInit } from '@angular/core';
import { InvestService } from './invest.service';
import { Router } from '@angular/router';
import { Invest } from './invest.interface';
import { SuccessfulInvestmentService } from './../successful-investment/successful-investment.service';
import { InvestorComponent } from './../investor.component';
import { WalletService } from '../../common/services/wallet.service';
import { ToastrService } from '../../common/services/toastr.service';
import { InvestmentAssetProtocolService as AssetService } from '../../common/services/protocol/investment-asset.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/protocol/swapy-protocol.service';

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
    private assetService: AssetService, private toastrService: ToastrService,
    private exchangeService: ExchangeService, private swapyProtocol: SwapyProtocol) {
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

  async invest() {
    try {
      const assetsAddress = this.investment.assets.map(asset => asset.contractAddress);
      await this.swapyProtocol.invest(assetsAddress, this.investment.totalAmount);
      this.toastrService.getInstance().success('Your investment was mined by the Ethereum blockchain.');
      this.successfulInvestmentService.setMessage('Your investment was mined by the Ethereum blockchain.');
    } catch (error) {
      this.successfulInvestmentService.setErrorMessage(error.message);
      this.toastrService.getInstance().error(this.successfulInvestmentService.getMessage());
    }
  }

}
