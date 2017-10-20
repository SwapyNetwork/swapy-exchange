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

  constructor(private successfulInvestmentService: SuccessfulInvestmentService, private investService: InvestService,
    private walletService: WalletService) { }

  ngOnInit() {
    this.successfulMessage = this.successfulInvestmentService.getSuccessfulMessages();
    this.errorsMessages = this.successfulInvestmentService.getErrorsMessages();
    this.offerIndex = this.investService.getCachedOfferIndex();
    this.walletAddress = this.walletService.getWallet().address;
  }

}
