import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WalletService } from '../common/services/wallet.service';
import { Web3Service } from '../common/services/web3.service';
import { LoadingService } from '../common/services/loading.service';
import { PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT, RETURNED,
  DELAYED_RETURN } from '../common/interfaces/offer-asset-status.interface';
import { DashboardService } from './dashboard/dashboard.service';



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

  constructor(private walletService: WalletService,
    private web3Service: Web3Service, private loadingService: LoadingService, private dashboardService: DashboardService) {}

  ngOnInit() {
    // this.refreshStatusBar();
  }

  public async refreshStatusBar() {
    this.loadingService.show();

    this.walletService.getEthBalance().then((balance) => {
      this.balance = balance;
    });

    const investments = this.dashboardService.getCachedInvestments();
    let assets = [];
    investments.forEach(investment => {
      investment.assets.forEach(asset => {
        asset['grossReturn'] = investment.grossReturn;
        asset['paybackDays'] = investment.paybackMonths * 30;
        asset['investedAt'] = new Date(investment.investedAt)
        asset['currentValue'] = asset.boughtValue || asset.value;
      });
      assets = assets.concat(investment.assets);
    })

    this.investedValue = 0;
    this.returnedValue = 0;
    this.returnValue = 0;

    this.investedValue = (assets.filter(asset => (
      Number(asset.status) >= PENDING_OWNER_AGREEMENT && Number(asset.status) <= DELAYED_RETURN))
      .map(asset => asset.currentValue)
      .reduce((total, current) => (total + current), 0));

    this.returnValue = assets.filter(asset => (
      Number(asset.status) >= PENDING_OWNER_AGREEMENT && Number(asset.status) <= PENDING_INVESTOR_AGREEMENT))
      .map(asset => asset.value + asset.value * asset.grossReturn)
      .reduce((total, current) => (total + current), 0);

    this.returnedValue = assets.filter(asset => (Number(asset.status) === RETURNED ||
      Number(asset.status) === DELAYED_RETURN))
      .map(asset => asset.value + asset.value * asset.grossReturn)
      .reduce((total, current) => (total + current), 0);

    const assetsLength = assets.filter(asset => Number(asset.status) >= PENDING_OWNER_AGREEMENT &&
      Number(asset.status) <= PENDING_INVESTOR_AGREEMENT).length;
    this.averageReturn = assets.filter(asset => Number(asset.status) >= PENDING_OWNER_AGREEMENT &&
      Number(asset.status) <= PENDING_INVESTOR_AGREEMENT)
      .map(asset => Number(asset.grossReturn))
      .reduce((total, current) => (total + current), 0);

    this.averageReturn = this.averageReturn === 0 ? 0 : (this.averageReturn / assetsLength).toFixed(4);

    const block = (await this.web3Service.getInstance().eth.getBlock('latest'));
    const now = block.timestamp * 1000;
    this.averagePaybackPeriod = assets.filter(asset =>
      Number(asset.status) >= PENDING_OWNER_AGREEMENT && Number(asset.status) <= PENDING_INVESTOR_AGREEMENT)
      .map(asset => {
        const returnDate = asset.investedAt.setMonth(asset.investedAt.getMonth() + asset.paybackDays / 30)
        return Math.floor((returnDate - now) / (24 * 3600 * 1000));
      })
      .reduce((total, current) => (total + current), 0);
    this.averagePaybackPeriod = this.averagePaybackPeriod === 0 ? 0 : Math.round(this.averagePaybackPeriod  / assetsLength);
    this.loadingService.hide();
    this.assetsLength = assets.length;
  };
}
