import { Component, OnInit } from '@angular/core';
import { SuccessfulInvestmentService } from './../successful-investment/successful-investment.service';
import { InvestService } from './../invest/invest.service';
import { WalletService } from '../../common/services/wallet.service';
import { StorageService } from '../../common/services/storage.service';

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

  constructor(public successfulInvestmentService: SuccessfulInvestmentService, private investService: InvestService,
    private walletService: WalletService, private storageService: StorageService) { }

  ngOnInit() {
    let message: string = null;
    if (this.storageService.getItem('uPort')) {
      message = 'Please confirm the transaction card in your uPort mobile app'
    }
    this.successfulInvestmentService.setMessage(message);
    this.offerIndex = this.investService.getCachedOfferIndex();
    this.walletAddress = this.walletService.getWallet().address;
  }

}
