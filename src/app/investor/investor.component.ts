import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WalletService } from '../common/services/wallet.service';
import { Web3Service } from '../common/services/web3.service';
import { LoadingService } from '../common/services/loading.service';
import { SwapyProtocolService as SwapyProtocol } from '../common/services/swapy-protocol.service';
import { PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT, RETURNED,
  DELAYED_RETURN } from '../common/interfaces/offer-asset-status.interface';
import { DashboardService } from './dashboard/dashboard.service';
import { Router } from '@angular/router';



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
  public ETHbalance;
  public tokenBalance;
  public ETHprice;
  public USDbalance;

  constructor(
    private walletService: WalletService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private swapyProtocol: SwapyProtocol,
    private router: Router,
    private dashboardService: DashboardService) {}

  ngOnInit() {
    // this.refreshStatusBar();
  }

  public async refresh() {
    this.loadingService.show();
    const url = this.router.url.split('/').slice(1);
    if (url[0] === 'investor') {
      if (url.length === 1) {
        // update investor Manage page
      } else if (url[url.length - 1] === 'marketplace') {
        // update investor Marketplace page
      } else if (url[url.length - 1] === 'offers') {
        // update investor Invest page
      }
    } else {

    }
    this.loadingService.hide();
  }

  public async refreshBalance() {
    this.loadingService.show();

    this.tokenBalance = (await this.swapyProtocol.getTokenBalance()) / Math.pow(10, 18);
    this.ETHbalance = await this.walletService.getEthBalance();
    this.ETHprice = await this.swapyProtocol.getEthPrice();
    this.USDbalance = this.ETHbalance * this.ETHprice;
    this.loadingService.hide();

    /*
    this.investedValue = 0;
    this.returnedValue = 0;
    this.returnValue = 0;
    const txInvested = [];
    const ForSale = await this.swapyProtocol.get('ForSale');
    let forSaleEvents = await this.swapyProtocol.get('ForSale');
    forSaleEvents = forSaleEvents.filter(event =>
      event.returnValues._investor.toLowerCase() === this.walletService.getWallet().address.toLowerCase());

    for (const forSaleEvent of forSaleEvents){
      const withdrawal = await this.swapyProtocol.getAssetEvent(forSaleEvent.returnValues._asset, 'Withdrawal');
      const events = [forSaleEvent].concat(withdrawal);
      events.sort((a, b) => (a.blockNumber < b.blockNumber) ? -1 : (a.blockNumber > b.blockNumber ? 1 : 0));
      const indexFS = events.map(event => event.event).indexOf('ForSale');
      if (events.length > indexFS + 1) {
        if (events[indexFS + 1].event === 'Withdrawal') {
          const investor = events[indexFS].returnValues._investor.toLowerCase();
          const owner = events[indexFS + 1].returnValues._owner.toLowerCase();
          if (investor === owner) {
            this.returnedValue += Number(events[indexFS].returnValues._value) / 100;
          }
        }

        if (indexFS === 1) {
          const value = (await this.swapyProtocol.getAssetConstants(events[indexFS].returnValues._asset, ['value'])).value;
          this.investedValue += Number(value) / 100;
        } else {
          let sliced = events.slice(1, indexFS);
          sliced = sliced.concat(ForSale.filter(forSale => forSale.returnValues._asset.toLowerCase() === forSaleEvent.returnValues._asset.toLowerCase()));
          sliced.sort((a, b) => (a.blockNumber < b.blockNumber) ? -1 : (a.blockNumber > b.blockNumber ? 1 : 0));
          let indexW = sliced.map(event => event.event).indexOf('Withdrawal');
          while (sliced.map(event => event.event).indexOf('Withdrawal') !== -1) {
            indexW = sliced.map(event => event.event).indexOf('Withdrawal');
            let index = indexW - 1;
            while (sliced[index].returnValues._investor.toLowerCase() !== sliced[indexW].returnValues._owner.toLowerCase() &&
              sliced[indexW].returnValues._investor.toLowerCase() !== this.walletService.getWallet().address.toLowerCase()) {
              index--;
            }

            if (sliced[index].returnValues._investor.toLowerCase() === sliced[indexW].returnValues._owner.toLowerCase() &&
              sliced[indexW].returnValues._investor.toLowerCase() === this.walletService.getWallet().address.toLowerCase() &&
              txInvested.indexOf(sliced[index].transactionHash) === -1) {
              txInvested.push(sliced[index].transactionHash);
              this.investedValue += sliced[index].returnValues._value / 100;
            }
            
            sliced = sliced.slice(indexW + 1);
          }
        }
      }
    }

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

    this.investedValue += (assets.filter(asset => (
      Number(asset.status) >= PENDING_OWNER_AGREEMENT && Number(asset.status) <= DELAYED_RETURN))
      .map(asset => asset.currentValue)
      .reduce((total, current) => (total + current), 0));

    this.returnValue = assets.filter(asset => (
      Number(asset.status) >= PENDING_OWNER_AGREEMENT && Number(asset.status) <= PENDING_INVESTOR_AGREEMENT))
      .map(asset => asset.value + asset.value * asset.grossReturn)
      .reduce((total, current) => (total + current), 0);

    this.returnedValue += assets.filter(asset => (Number(asset.status) === RETURNED ||
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
    */
  };

}
