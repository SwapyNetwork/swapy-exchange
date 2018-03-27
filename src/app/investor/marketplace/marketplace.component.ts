import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../common/services/loading.service';
import { MarketplaceService } from './marketplace.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { WalletService } from '../../common/services/wallet.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';


@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  public assets = [];

  constructor(
    private loadingService: LoadingService,
    private swapyProtocol: SwapyProtocol,
    private marketplaceService: MarketplaceService,
    private walletService: WalletService
  ) { }

  ngOnInit() {
    this.getAssetsForSale();
  }

  public async getAssetsForSale() {
    this.assets = await this.marketplaceService.getAssetsForSale();
    console.log(this.assets);
  }

}
