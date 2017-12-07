import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { CreditCompanyService } from './credit-company.service';
import { WalletService } from '../common/services/wallet.service';
import { ExchangeProtocolService } from '../common/services/protocol/exchange.service';
import { InvestmentAssetProtocolService as AssetService } from '../common/services/protocol/investment-asset.service';
import { INVESTED, RETURNED } from '../common/interfaces/offerAssetStatus.interface';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'credit-company-root',
  templateUrl: './credit-company.component.html',
  styleUrls: ['./credit-company.component.css']
})
export class CreditCompanyComponent implements OnInit {
  title = 'credit-company';

  public amountRequested;
  public amountRaised;
  public amountReturned;
  public offersLength;
  public balance;

  constructor(private creditCompanyService: CreditCompanyService, private walletService: WalletService,
    private exchangeProtocolService: ExchangeProtocolService, private assetService: AssetService) {};

  ngOnInit() {
    this.refreshStatusBar();
  };

  refreshStatusBar() { /**@todo Refresh via websocket when a investment is done */

    this.exchangeProtocolService.getMyOffers(this.walletService.getWallet().address, (error, offers) => {
      console.log(offers);
      const promises = [];
      offers.forEach(offer => {
        promises.push(this.getStatistics(offer));
      });
      Promise.all(promises).then(assetValues => {
        this.walletService.getEthBalance().then((balance) => {
          this.balance = balance;
        });
        const assets = assetValues.reduce((last, current) => (last.concat(current)), []);
        this.amountRequested = (assets.map(values => Number(values.fixedValue))
          .reduce((total: number, current: number) => (total + current), 0)) / 100;
        this.amountRaised = (assets.filter(asset => Number(asset.status) >= INVESTED)
          .map(values => Number(values.fixedValue))
          .reduce((total: number, current: number) => (total + current), 0)) / 100;
        this.amountReturned = (assets.filter(asset => Number(asset.status) >= RETURNED)
          .map(values => Number(values.fixedValue) + Number(values.fixedValue) * Number(values.grossReturn / 10000))
          .reduce((total: number, current: number) => (total + current), 0)) / 100;
        this.offersLength = offers.length;
      });
    });
  }

  getStatistics(offer) {
    return new Promise ((resolve) => {
      const assetObject = [];
      offer.returnValues._assets.forEach((asset, index) => {
        const constants = ['status', 'fixedValue', 'grossReturn'];
        this.assetService.getConstants(asset, constants).then(assetValues => {
          assetObject.push(assetValues);
          if (index === offer.returnValues._assets.length - 1) {
            resolve(assetObject);
          }
        });
      });
    });
  }
}
