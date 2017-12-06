import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { InvestorService } from './investor.service';
import { WalletService } from '../common/services/wallet.service';
import { Web3Service } from '../common/services/web3.service';
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
  public returnedValue;
  public averagePaybackPeriod;
  public balance;

  constructor(private investorService: InvestorService, private walletService: WalletService,
    private exchangeProtocolService: ExchangeProtocolService, private assetService: AssetService,
    private web3Service: Web3Service) {}

  ngOnInit() {
    this.refreshStatusBar();
  }

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

        this.investedValue = (assets.filter(asset => Number(asset.status) >= INVESTED)
          .map(asset => Number(asset.fixedValue))
          .reduce((total, current) => (total + current), 0)) / 100;

        this.returnValue = (assets.filter(asset => Number(asset.status) === INVESTED)
          .map(asset => Number(asset.fixedValue) + Number(asset.fixedValue) * Number(asset.grossReturn / 10000))
          .reduce((total, current) => (total + current), 0)) / 100;

        this.returnedValue = (assets.filter(asset => Number(asset.status) >= RETURNED)
          .map(asset => Number(asset.fixedValue) + Number(asset.fixedValue) * Number(asset.grossReturn / 10000))
          .reduce((total, current) => (total + current), 0)) / 100;

        const assetsLength = assets.filter(asset => Number(asset.status) === INVESTED).length;
        this.averageReturn = (assets.filter(asset => Number(asset.status) === INVESTED)
          .map(asset => Number(asset.grossReturn))
          .reduce((total, current) => (total + current), 0));
        this.averageReturn = this.averageReturn === 0 ? 0 : (this.averageReturn  / 10000 / assetsLength).toFixed(4);

        this.web3Service.getInstance().eth.getBlock('latest').then(block => {
          const now = block.timestamp * 1000;
          this.averagePaybackPeriod = assets.filter(asset => Number(asset.status) === INVESTED)
            .map(asset => {
              const returnDate = asset.investedIn.setMonth(asset.investedIn.getMonth() + asset.paybackDays / 30)
              return Math.floor((returnDate - now) / (24 * 3600 * 1000));
            })
            .reduce((total, current) => (total + current), 0);
            this.averagePaybackPeriod = this.averagePaybackPeriod === 0 ? 0 : this.averagePaybackPeriod  / assetsLength;
        });

        this.assetsLength = assets.length;
      });
    });
  };

  getStatistics(investment) {
    return new Promise ((resolve) => {
      let assetObject = [];
      investment.returnValues._assets.forEach((asset, index) => {
        const constants = ['status', 'fixedValue', 'investor', 'grossReturn', 'paybackDays'];
        this.assetService.getConstants(asset, constants).then(assetValues => {
          this.web3Service.getInstance().eth.getBlock(investment.blockHash).then(block => {
            assetValues['investedIn'] = (new Date(block.timestamp * 1000));
            assetObject.push(assetValues);
            if (index === investment.returnValues._assets.length - 1) {
              // assetObject = assetObject.reduce((last, current) => (last.concat(current)), []);
              assetObject = assetObject.filter(inv => inv.investor === this.walletService.getWallet().address);
              resolve(assetObject);
            }
          });
        });
      });
    });

  }
}
