import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { WalletService } from '../common/services/wallet.service';
import { LoadingService } from '../common/services/loading.service';
import { PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT, RETURNED,
  DELAYED_RETURN } from '../common/interfaces/offer-asset-status.interface';
import { DashboardService } from './dashboard/dashboard.service';
import { SwapyProtocolService as SwapyProtocol } from '../common/services/swapy-protocol.service';


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
  public nextReturnDate;
  public nextReturnValue;
  public assetsLength;

  public ETHbalance;
  public tokenBalance;
  public ETHprice;
  public USDbalance;

  public isElectron;

  constructor(
    private walletService: WalletService,
    private loadingService: LoadingService,
    private swapyProtocol: SwapyProtocol,
    private dashboardService: DashboardService) {
      this.isElectron = (window as any).isElectron;
    };

  ngOnInit() {
    this.refreshBalance();
  };

  public triggerMetamaskPopup() {
    (window as any).chrome.ipcRenderer.send('open-metamask-popup');
  }

  public async refresh() {
  }

  public getStatistics() {
    return {
      assetsLength: this.assetsLength,
      amountRequested: this.amountRequested,
      amountRaised: this.amountRaised,
      amountToBeReturned: this.amountToBeReturned,
      nextReturnDate: this.nextReturnDate,
      nextReturnValue: this.nextReturnValue,
    }
  }

  public async refreshBalance() {
    this.loadingService.show();

    this.amountRequested = 0;
    this.amountRaised = 0;
    this.amountToBeReturned = 0;
    this.nextReturnDate = null;
    this.nextReturnValue = null;

    this.tokenBalance = (await this.swapyProtocol.getTokenBalance()) / Math.pow(10, 18);
    this.ETHbalance = await this.walletService.getEthBalance();
    this.ETHprice = await this.swapyProtocol.getEthPrice();
    this.USDbalance = this.ETHbalance * this.ETHprice;
    
    const offers = this.dashboardService.getCachedOffers() || [];
    let assets = [];
    offers.forEach(offer => {
      offer.assets.forEach(asset => {
        asset['grossReturn'] = offer.grossReturn;
        asset.status = Number(asset.status);
      });
      assets = assets.concat(offer.assets);
    });
    this.amountRequested = (assets.map(values => values.value)
      .reduce((total: number, current: number) => (total + current), 0));
    this.amountRaised = (assets.filter(asset => (asset.status === INVESTED ||
      asset.status === FOR_SALE ||
      asset.status === PENDING_INVESTOR_AGREEMENT ||
      asset.status === RETURNED ||
      asset.status === DELAYED_RETURN))
      .map(values => values.value)
      .reduce((total: number, current: number) => (total + current), 0));
    this.amountToBeReturned = (assets.filter(asset =>
      (asset.status === INVESTED || asset.status === FOR_SALE || asset.status === PENDING_INVESTOR_AGREEMENT))
      .map(values => values.value + values.value * values.grossReturn)
      .reduce((total: number, current: number) => (total + current), 0));

    const investedAssets = assets.filter(asset => (
      asset.status === PENDING_OWNER_AGREEMENT ||
      asset.status === INVESTED ||
      asset.status === FOR_SALE ||
      asset.status === PENDING_INVESTOR_AGREEMENT)
    );

    if (investedAssets.length > 0) {
      assets = assets.sort((a, b) => Number(a.investedAt) - Number(b.investedAt));
      this.nextReturnDate = new Date(assets[0].investedAt);
      this.nextReturnDate.setMonth(this.nextReturnDate.getMonth() + assets[0].paybackMonths);
      this.nextReturnValue = assets[0].value * (1 + assets[0].grossReturn);
    }
    // this.amountReturned = (assets.filter(asset => (asset.status === RETURNED || asset.status === DELAYED_RETURN))
    //   .map(values => values.value + values.value * values.grossReturn)
    //   .reduce((total: number, current: number) => (total + current), 0));
    this.assetsLength = assets.length;    

    this.loadingService.hide();
  }
}
