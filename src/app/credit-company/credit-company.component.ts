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
  public offersLength;
  public balance;

  constructor(private creditCompanyService: CreditCompanyService, private walletService: WalletService,
    private exchangeProtocolService: ExchangeProtocolService, private assetService: AssetService) {};

  ngOnInit() {
    this.refreshStatusBar();
  };

  refreshStatusBar() { /**@todo Refresh via websocket when a investment is done */
    // this.creditCompanyService.getMyOffersInfos().then(
    //   (data: any) => {
    //     this.amountRequested = data.amountRequested;
    //     this.amountRaised = data.amountRaised;
    //     this.offersLength = data.offersLength;
    //     this.walletService.getEthBalance().then((balance) => {
    //       this.balance = balance;
    //     }, (error) => {
    //       console.error(error);
    //     });
    //   },
    //   (error: any) => {
    //     console.error(error);
    //   }
    // );

    this.exchangeProtocolService.getMyOffers(this.walletService.getWallet().address, (error, offers) => {
      console.log(offers);
      const promises = [];
      offers.forEach(offer => {
        promises.push(this.getStatistics(offer));
      });
      Promise.all(promises).then(assetValues => {
        console.log(assetValues);
        this.amountRequested = (assetValues.reduce((last, current) => (last.concat(current)), [])
          .map(values => Number(values.fixedValue))
          .reduce((total: number, current: number) => (total + current), 0)) / 100;
        this.amountRaised = (assetValues.reduce((last, current) => (last.concat(current)), [])
          .filter(asset => asset.status === Number(INVESTED) || asset.status === Number(RETURNED))
          .map(values => Number(values.fixedValue))
          .reduce((total: number, current: number) => (total + current), 0)) / 100;
        this.offersLength = offers.length;
      });
    });
  }

  getStatistics(offer) {
    return new Promise ((resolve) => {
      const assetObject = [];
      offer.returnValues._assets.forEach((asset, index) => {
        const constants = ['status', 'fixedValue'];
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
