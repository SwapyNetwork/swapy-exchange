import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { CreditCompanyService } from './credit-company.service';
import { WalletService } from '../common/services/wallet.service';
import { LoadingService } from '../common/services/loading.service';
import { ExchangeProtocolService } from '../common/services/protocol/exchange.service';
import { InvestmentAssetProtocolService as AssetService } from '../common/services/protocol/investment-asset.service';
import { INVESTED, RETURNED } from '../common/interfaces/offerAssetStatus.interface';
import { DashboardService } from './dashboard/dashboard.service';


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
  public amountToBeReturned;
  public offersLength;
  public balance;

  constructor(private creditCompanyService: CreditCompanyService, private walletService: WalletService,
    private exchangeProtocolService: ExchangeProtocolService, private assetService: AssetService,
    private loadingService: LoadingService, private dashboardService: DashboardService) {};

  ngOnInit() {
    // this.refreshStatusBar();
  };

  refreshStatusBar() { /**@todo Refresh via websocket when a investment is done */
    this.loadingService.show();
    const offers = this.dashboardService.getCachedOffers()
    this.walletService.getEthBalance().then((balance) => {
      this.balance = balance;
    });
    let assets = [];
    offers.forEach(offer => {
      offer.assets.forEach(asset => {
        asset['grossReturn'] = offer.grossReturn;
        asset.status = Number(asset.status);
      });
      assets = assets.concat(offer.assets);
    });
    // const assets = assetValues.reduce((last, current) => (last.concat(current)), []);
    this.amountRequested = (assets.map(values => values.value)
      .reduce((total: number, current: number) => (total + current), 0));
    this.amountRaised = (assets.filter(asset => asset.status >= INVESTED)
      .map(values => values.value)
      .reduce((total: number, current: number) => (total + current), 0));
    this.amountReturned = (assets.filter(asset => asset.status >= RETURNED)
      .map(values => values.value + values.value * values.grossReturn)
      .reduce((total: number, current: number) => (total + current), 0));
    this.amountToBeReturned = (assets.filter(asset => asset.status === INVESTED)
      .map(values => values.value + values.value * values.grossReturn)
      .reduce((total: number, current: number) => (total + current), 0));
    this.offersLength = offers.length;
    this.loadingService.hide();
  }
}
