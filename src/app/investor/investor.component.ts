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
        this.walletService.getEthBalance().then((balance) => {
          this.balance = balance;
        });
        assets = assets.reduce((last, current) => (last.concat(current)), []);

        this.investedValue = 0;
        this.returnedValue = 0;
        this.returnValue = 0;

        // const t1 = performance.now();
        // for (let index = 0; index < assets.length; index++) {
        //   if (Number(assets[index].status) >= INVESTED) {
        //     this.investedValue += Number(assets[index].fixedValue);
        //   }
        //   if (Number(assets[index].status) >= RETURNED) {
        //     this.returnedValue += Number(assets[index].fixedValue) +
        //       Number(assets[index].fixedValue) * Number(assets[index].grossReturn / 10000);
        //   }
        //   if (Number(assets[index].status) === INVESTED) {
        //     this.returnValue += Number(assets[index].fixedValue) +
        //       Number(assets[index].fixedValue) * Number(assets[index].grossReturn / 10000);
        //   }
        // }
        // const t2 = performance.now();

        this.investedValue = (assets.filter(asset => Number(asset.status) >= INVESTED)
          .map(asset => Number(asset.fixedValue))
          .reduce((total, current) => (total + current), 0)) / 100;

        this.returnValue = (assets.filter(asset => Number(asset.status) === INVESTED)
          .map(asset => Number(asset.fixedValue) + Number(asset.fixedValue) * Number(asset.grossReturn / 10000))
          .reduce((total, current) => (total + current), 0)) / 100;

        this.returnedValue = (assets.filter(asset => Number(asset.status) >= RETURNED)
          .map(asset => Number(asset.fixedValue) + Number(asset.fixedValue) * Number(asset.grossReturn / 10000))
          .reduce((total, current) => (total + current), 0)) / 100;

        // const t3 = performance.now();
        //
        // console.log('Part I => ' + (t2 - t1).toFixed(4));
        // console.log('Part II => ' + (t3 - t2).toFixed(4));

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
      this.web3Service.getInstance().eth.getBlock(investment.blockHash).then(block => {
        investment.returnValues._assets.forEach((asset, index) => {
            this.assetService.getContract(asset).methods.getAsset().call().then(returned => {
              const assetValues = {
                status: returned[5],
                fixedValue: returned[2],
                investor: returned[6],
                grossReturn: returned[4],
                paybackDays: returned[3],
                investedIn: new Date(block.timestamp * 1000)
              };
            assetObject.push(assetValues);
            if (index === investment.returnValues._assets.length - 1) {
              assetObject = assetObject.filter(inv => inv.investor === this.walletService.getWallet().address);
              resolve(assetObject);
            }
          });
        });
      });
    });
  }
}
