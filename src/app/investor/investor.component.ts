import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { InvestorService } from './investor.service';
import { WalletService } from '../common/services/wallet.service';
import { ExchangeProtocolService } from '../common/services/protocol/exchange.service';
import { InvestmentAssetProtocolService as AssetService } from '../common/services/protocol/investment-asset.service';
import { INVESTED, RETURNED } from '../common/interfaces/offerAssetStatus.interface';



@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'investor-root',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.css']
})
export class InvestorComponent implements OnInit {
  title = 'investor';

  public assetsLength;
  public investedValue;
  public averageReturn;
  public returnValue;
  public averagePaybackPeriod;
  public balance;

  constructor(private investorService: InvestorService, private walletService: WalletService,
    private exchangeProtocolService: ExchangeProtocolService, private assetService: AssetService) {};

  ngOnInit() {
    this.refreshStatusBar();
  };

  refreshStatusBar() {

    this.exchangeProtocolService.getMyInvestments(this.walletService.getWallet().address, (error, investments) => {
      const promises = [];
      investments.forEach(investment => {
        promises.push(this.getStatistics(investment));
      });
      Promise.all(promises).then(assets => {
        console.log(assets);
        this.walletService.getEthBalance().then((balance) => {
          this.balance = balance;
        });
        assets = assets.reduce((last, current) => (last.concat(current)), []);

        this.investedValue = (assets.filter(asset => Number(asset.status) === INVESTED || Number(asset.status) === RETURNED)
          .map(asset => Number(asset.fixedValue))
          .reduce((total, current) => (total + current), 0)) / 100;
        this.returnValue = (assets.filter(asset => Number(asset.status) === INVESTED)
          .map(asset => Number(asset.fixedValue) + Number(asset.fixedValue) * Number(asset.grossReturn / 10000))
          .reduce((total, current) => (total + current), 0)) / 100;
        this.assetsLength = assets.length;
      });
    });
  };

  getStatistics(investment) {
    return new Promise ((resolve) => {
      let assetObject = [];
      investment.returnValues._assets.forEach((asset, index) => {
        const constants = ['status', 'fixedValue', 'investor', 'grossReturn'];
        this.assetService.getConstants(asset, constants).then(assetValues => {
          assetObject.push(assetValues);
          if (index === investment.returnValues._assets.length - 1) {
            // assetObject = assetObject.reduce((last, current) => (last.concat(current)), []);
            assetObject = assetObject.filter(inv => inv.investor === this.walletService.getWallet().address);
            resolve(assetObject);
          }
        });
      });
    });

  }
}
