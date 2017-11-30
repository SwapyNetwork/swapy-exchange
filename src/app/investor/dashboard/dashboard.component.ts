import { Component, OnInit } from '@angular/core';
import { InvestService } from './../invest/invest.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../common/services/protocol/investment-asset.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { AGREE_INVESTMENT, TRANSFER_FUNDS } from '../../common/interfaces/events.interface';
import { WalletService } from '../../common/services/wallet.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public investments;

  constructor(
    private investService: InvestService,
    private exchangeService: ExchangeService,
    private errorLogService: ErrorLogService,
    private walletService: WalletService,
    private investmentAssetService: InvestmentAssetService) { }

  ngOnInit() {
    this.updateInvestments();
    this.getMyInvestmentsFromBlockchain();
  }

  updateInvestments() {
    // this.investService.getMyInvestments().then(
    //   (data: any) => {
    //     this.investments = data.investments;
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
  }

  buildInvestments(offer) {
    return new Promise((resolve, reject) => {
      offer._assets.forEach(asset => {
          this.investmentAssetService.getContract(asset).methods
            .investor().call().then(investor => {
            });
      });
    });
  }

  getMyInvestmentsFromBlockchain() {
    this.exchangeService.getMyInvestments(this.walletService.getWallet().address, (error, investmentsEvents) => {
      const promises = [];
      investmentsEvents.forEach(investment => {
        console.log(investment);
        // promises.push(this.buildInvestments(investment));
      })
    })
  }

}
