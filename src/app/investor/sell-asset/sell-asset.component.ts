import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SellAssetService } from './sell-asset.service'
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'app-sell-asset',
  templateUrl: './sell-asset.component.html',
  styleUrls: ['./sell-asset.component.css']
})
export class SellAssetComponent implements OnInit {

  private asset;
  private value: string;

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
    private sellAssetService: SellAssetService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.asset = this.sellAssetService.getCachedAsset();
  }

  public sellAsset() {
    this.asset.sellValue = parseFloat(this.value.replace(/[^0-9.]/g, ''));
    this.sellAssetService.cacheAsset(this.asset);
    this.router.navigate(['investor/sell/confirm-sale'])
  }

}
