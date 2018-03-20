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
    private walletService: WalletService
  ) { }

  ngOnInit() {
    this.getAssetsForSale();
  }

  private getDisplayWalletAddress(address: string) {
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`
  }

  private deleteDuplicatedAssets(assets) {
    for (let index = assets.length - 2; index >= 0; index--) {
      if (assets[assets.length - 1].address === assets[index].address && assets.length !== 1) {
        assets.splice(index, 1);
      }
    }

    return assets;
  }

  public async getAssetsForSale() {
    this.loadingService.show();
    try {
      const forSaleEvents = await this.swapyProtocol.get('ForSale');

      forSaleEvents.forEach(async forSaleEvent => {
        const assetAddress = forSaleEvent.returnValues._asset;
        const assetValue = forSaleEvent.returnValues._value;
        const investor = forSaleEvent.returnValues._investor.toLowerCase();
        const constants = ['grossReturn', 'paybackDays', 'status', 'value', 'investedAt', 'tokenFuel', 'owner'];
        const assetConstants = await this.swapyProtocol.getAssetConstants(assetAddress, constants);
        const asset = {
          address: assetAddress,
          companyAddress: assetConstants.owner,
          investor: investor,
          token: assetConstants.tokenFuel / Math.pow(10, 18),
          grossReturn: assetConstants.grossReturn / 10000,
          paybackMonths: assetConstants.paybackDays / 30,
          originalValue: assetConstants.value / 100,
          value: assetValue / 100,
          investedAt: assetConstants.investedAt * 1000
        };
        if (Number(assetConstants.status) === FOR_SALE && investor !== this.walletService.getWallet().address.toLowerCase()) {
          this.assets.push(asset);
          this.assets = this.deleteDuplicatedAssets(this.assets);
        }
      });


      this.loadingService.hide();

    } catch (error) {
      this.loadingService.hide();
      console.error(error);

    }
  }

}
