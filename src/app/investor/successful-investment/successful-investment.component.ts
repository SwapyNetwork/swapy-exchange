import { Component, OnInit } from '@angular/core';
import { SuccessfulInvestmentService } from './../successful-investment/successful-investment.service';
import { InvestService } from './../invest/invest.service';
import { WalletService } from '../../common/services/wallet.service';

@Component({
  selector: 'app-successful-investment',
  templateUrl: './successful-investment.component.html',
  styleUrls: ['./successful-investment.component.css']
})
export class SuccessfulInvestmentComponent implements OnInit {

  public successfulMessage: string;
  public errorsMessages: string;
  private offerIndex: number;
  public walletAddress: string;

  public investment;

  constructor(
    public successfulInvestmentService: SuccessfulInvestmentService,
    private investService: InvestService,
    private walletService: WalletService) { }

  ngOnInit() {
    this.investment = this.successfulInvestmentService.getCachedInvestment();
    this.offerIndex = this.investService.getCachedOfferIndex();
    this.walletAddress = this.walletService.getWallet().address;
    this.successfulInvestmentService.cleanMessages();
  }

}
