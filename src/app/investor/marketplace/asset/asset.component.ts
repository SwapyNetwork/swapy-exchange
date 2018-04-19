import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MarketplaceService } from '../marketplace.service';

@Component({
  selector: 'asset-card',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit {

  @Input() public asset;
  @Input() public assetIndex;
  constructor(
    private router: Router,
    private marketplaceService: MarketplaceService
  ) { }

  ngOnInit() {
    this.calculateReturn();
  }

  public buy() {
    this.marketplaceService.cacheAsset(this.asset);
    this.router.navigate(['investor/marketplace/confirm-purchase']);
  }

  public calculateReturn() {
    const investedAt = new Date(this.asset.investedAt);
    this.asset.returnOn = investedAt.setMonth(investedAt.getMonth() + this.asset.paybackMonths)
  }

  public calculateAssetProgression() {
    const paybackDate = new Date(this.asset.investedAt);
    const now = new Date();
    const monthsDiff = (now.getFullYear() * 12 + now.getMonth()) - (paybackDate.getFullYear() * 12 + paybackDate.getMonth());
    return monthsDiff;
  }

  public percentageProgression() {
    const percentage = this.calculateAssetProgression() * 100 / this.asset.paybackMonths;
    return Math.floor(percentage / 5) * 5;
  }

}
