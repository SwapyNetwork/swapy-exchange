import { Component, OnInit } from '@angular/core';
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
    private sellAssetService: SellAssetService
  ) { }

  ngOnInit() {
    this.asset = this.sellAssetService.getCachedAsset();
    console.log(this.asset);
  }

  public sellAsset() {
    this.asset.sellValue = parseFloat(this.value.replace(/[^0-9.]/g, ''));
    this.sellAssetService.cacheAsset(this.asset);
  }

}
