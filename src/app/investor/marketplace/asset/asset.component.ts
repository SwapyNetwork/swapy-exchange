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
  }

  public buy(asset) {
    this.marketplaceService.cacheAsset(asset);
    this.router.navigate(['investor/marketplace/confirm-purchase']);

  }

}
