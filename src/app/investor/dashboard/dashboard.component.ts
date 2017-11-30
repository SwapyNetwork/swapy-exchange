import { Component, OnInit } from '@angular/core';
import { InvestService } from './../invest/invest.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../common/services/protocol/investment-asset.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { AGREE_INVESTMENT, TRANSFER_FUNDS } from '../../common/interfaces/events.interface';
import { WalletService } from '../../common/services/wallet.service';
import { Web3Service } from '../../common/services/web3.service';
import { LoadingService } from '../../common/services/loading.service';

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
    private web3Service: Web3Service,
    private loadingService: LoadingService,
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

  buildInvestments(investment) {
    return new Promise((resolve, reject) => {
      this.web3Service.getInstance().eth.getBlock(investment.blockHash).then(block => {
        const asset = investment.returnValues._asset;
        this.investmentAssetService.getContract(asset).methods.getAsset().call().then(assetValues => {
          if (Number(assetValues[5]) !== 0 && assetValues[6] === this.walletService.getWallet().address) {
            const newInvestment = {
              investedIn: (new Date(block.timestamp * 1000)).toISOString(),
              assets: [],
              totalAmount: 0,
              grossReturn: 0,
              paybackMonths: 0,
              contractAddress: asset,
              creditCompanyAddress: investment.returnValues._owner,
            };
            const newAsset = {
              contractAddress: asset,
              status: Number(assetValues[5]),
              value: assetValues[2] / 100
            };
            newInvestment.assets.push(newAsset);
            newInvestment.paybackMonths = assetValues[3] / 30;
            newInvestment.totalAmount = assetValues[2] * 5 / 100;
            newInvestment.grossReturn = assetValues[4] / 10000;
            resolve(newInvestment);
          } else {
            resolve(false);
          }
        });
      });
    });
  }

  getMyInvestmentsFromBlockchain() {
    this.loadingService.show();
    this.exchangeService.getMyInvestments(this.walletService.getWallet().address, (error, investmentsEvents) => {
      const promises = [];
      investmentsEvents.forEach(investment => {
        promises.push(this.buildInvestments(investment));
      });

      Promise.all(promises).then(resolvedInvestments => {
        this.investments = resolvedInvestments.filter(investment => investment);
        this.loadingService.hide();
      }, err => {
        console.error(err);
        this.loadingService.hide();
      })
    })
  }

}
