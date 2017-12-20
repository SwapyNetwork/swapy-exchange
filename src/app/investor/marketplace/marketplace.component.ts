import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../common/services/loading.service';
import { MarketplaceService } from './marketplace.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { WalletService } from '../../common/services/wallet.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offerAssetStatus.interface';


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
    private walletService: WalletService
  ) { }

  ngOnInit() {
    this.getAssetsForSale();
  }

  private getDisplayWalletAddress(address: string) {
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`
  }

  public async getAssetsForSale() {
    this.loadingService.show();
    try {
      const forSaleEvents = await this.swapyProtocol.get('ForSale');

      forSaleEvents.forEach(async forSaleEvent => {
        const assetAddress = forSaleEvent.returnValues._asset;
        const assetValue = forSaleEvent.returnValues._value;
        const investor = forSaleEvent.returnValues._investor.toLowerCase();
        const assetConstants = await this.swapyProtocol.getAssetConstants(assetAddress, ['grossReturn', 'paybackDays', 'status']);
        const asset = {
          address: assetAddress,
          displayAddress: this.getDisplayWalletAddress(assetAddress),
          investor: investor,
          grossReturn: assetConstants.grossReturn / 10000,
          paybackMonths: assetConstants.paybackDays / 30,
          value: assetValue / 100
        };
        if (Number(assetConstants.status) === FOR_SALE && investor != this.walletService.getWallet().address.toLowerCase()) {
          this.assets.push(asset);
        }
      });

      this.loadingService.hide();

    } catch (error) {
      this.loadingService.hide();
      console.error(error);

    }
  }

}
