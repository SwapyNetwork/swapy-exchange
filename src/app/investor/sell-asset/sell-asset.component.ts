import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';
import { SellAssetService } from './sell-asset.service';
import { StorageService } from '../../common/services/storage.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { ToastrService } from '../../common/services/toastr.service';
import { InvestorComponent } from '../investor.component';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';

import * as sha1 from 'sha1';

@Component({
  selector: 'app-sell-asset',
  templateUrl: './sell-asset.component.html',
  styleUrls: ['./sell-asset.component.css']
})
export class SellAssetComponent implements OnInit {

  public assets;
  public sellPrice = [];

  public amountMask = createNumberMask({
    prefix: 'US$ ',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
  });

  constructor(
    private router: Router,
    public investorComponent: InvestorComponent,
    private toastrService: ToastrService,
    private swapyProtocol: SwapyProtocol,
    private storageService: StorageService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.assets = this.dashboardService.getSelectedAssets();
    this.setSellPrice();
  }

  public sellAssets() {
    this.sellPrice = this.sellPrice.map(price => parseFloat(price.replace(/[^0-9.]/g, '')));
    /*
    this.asset.sellValue = parseFloat(this.value.replace(/[^0-9.]/g, ''));
    this.sellAssetService.cacheAsset(this.asset);
    this.router.navigate(['investor/sell/confirm-sale'])
    */
  }

  public setSellPrice() {
    this.assets.forEach((asset, index) => {
      const progression = this.calculateAssetProgression(asset) * 100 / asset.paybackMonths;
      this.sellPrice[index] = asset.value * (1 + asset.grossReturn * progression / 100);
    });
  }

  public calculateReturnAmount(asset) {
    return asset.value * (1 + asset.grossReturn);
  }

  public calculatePaybackDate(asset) {
    const paybackDate = new Date(asset.investedAt);
    paybackDate.setMonth(paybackDate.getMonth() + asset.paybackMonths);
    return paybackDate;
  }

  public calculateAssetProgression(asset) {
    const paybackDate = new Date(asset.investedAt);
    const now = new Date();
    const monthsDiff = (now.getFullYear() * 12 + now.getMonth()) - (paybackDate.getFullYear() * 12 + paybackDate.getMonth());
    return monthsDiff;
  }

  public porcentageProgression(asset) {
    const porcentage = this.calculateAssetProgression(asset) * 100 / asset.paybackMonths;
    return Math.floor(porcentage / 5) * 5;
  }

  private onError(error, assets, status) {
    assets.forEach(asset => {
      this.storageService.remove(asset.contractAddress);
    });
    if (sha1(error.message) === '699e7c6d81ba58075ee84cf2a640c18a409efcba') { // 50 blocks later and transaction has not being mined yet.
      this.toastrService.error('Transaction is still being mined. Check it out later to see if the transaction was mined');
    } else {
      assets.forEach((asset, index) => {
        asset.status = status[index];
      });
      this.toastrService.error(error.message);
    }
  }

  public async sellAsset() {
    // this.router.navigate(['investor/invest/success']);
    const status = []
    this.assets.forEach(asset => {
      status.push(asset.status);
      this.storageService.setItem(asset.contractAddress, asset.status);
      asset.status = PENDING_ETHEREUM_CONFIRMATION;
    });
    const prices = this.sellPrice.map(price => parseFloat(price.replace(/[^0-9.]/g, '')) * 100);
    const contractAddresses = this.assets.map(asset => asset.contractAddress);
    try {
      await this.swapyProtocol.sellAssets(contractAddresses, prices);
      this.toastrService.getInstance().success('Asset inserted into the Marketplace');
      // this.successfulInvestmentService.setMessage('Your investment was mined by the Ethereum blockchain.');
      // this.storageService.getItem(this.asset.contractAddress);
    } catch (error) {
      // this.storageService.remove(this.asset.contractAddress);
      // this.asset.status = status;
      // this.successfulInvestmentService.setErrorMessage(error.message);

      this.onError(error, this.assets, status);
   
      // this.assets.forEach((asset, index) => {
      //   asset.status = status[index];
      //   this.storageService.remove(asset.contractAddress);
      // });
      // this.toastrService.error(error.message);
    }
  }

}
