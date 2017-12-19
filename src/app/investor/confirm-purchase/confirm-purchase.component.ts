import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace/marketplace.service';


@Component({
  selector: 'app-confirm-purchase',
  templateUrl: './confirm-purchase.component.html',
  styleUrls: ['./confirm-purchase.component.css']
})
export class ConfirmPurchaseComponent implements OnInit {

  private asset;
  constructor(
    private marketplaceService: MarketplaceService
  ) { }

  ngOnInit() {
    this.asset = this.marketplaceService.getCachedAsset();
  }

}
