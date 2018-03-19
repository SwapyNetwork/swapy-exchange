import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';
import { SellAssetService } from './sell-asset.service';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

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
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.assets = this.dashboardService.getSelectedAssets();
    this.setSellPrice();
  }

  public sellAssets() {
    this.sellPrice = this.sellPrice.map(price => parseFloat(price.replace(/[^0-9.]/g, '')));
    console.log(this.sellPrice);
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

}
