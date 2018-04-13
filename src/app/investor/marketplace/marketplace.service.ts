import { Injectable } from '@angular/core';
import { LoadingService } from '../../common/services/loading.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { WalletService } from '../../common/services/wallet.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';

@Injectable()
export class MarketplaceService {

  public cachedAsset;
  public assets = [];

  constructor(
    private loadingService: LoadingService,
    private swapyProtocol: SwapyProtocol,
    private walletService: WalletService
  ) { }

  public cacheAsset(asset) {
    this.cachedAsset = asset;
  }

  private deleteDuplicatedAssets(assets) {
    for (let index = assets.length - 2; index >= 0; index--) {
      if (assets[assets.length - 1].address === assets[index].address && assets.length !== 1) {
        assets.splice(index, 1);
      }
    }

    return assets;
  }

  public getCachedAsset() {
    return this.cachedAsset;
  }

  public getAssets() {
    return this.assets;
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
        if (Number(assetConstants.status) === FOR_SALE && investor.toLowerCase() !== this.walletService.getWallet().address.toLowerCase()) {
          this.assets.push(asset);
          this.assets = this.deleteDuplicatedAssets(this.assets);
        }
      });


      this.loadingService.hide();
      return this.assets;

    } catch (error) {
      this.loadingService.hide();
      console.error(error);

    }
  }

}
