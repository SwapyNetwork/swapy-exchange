import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Offer } from '../../common/interfaces/offer.interface';
import { LoadingService } from '../../common/services/loading.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';

@Injectable()
export class OfferService {

  private cachedOffers: Offer[];
  private offers = [];

  constructor(
    private loadingService: LoadingService,
    private swapyProtocol: SwapyProtocol
  ) {}

  public cacheOffers(offers: Offer[]) {
    this.cachedOffers = offers;
  }

  public getCachedOffers(): Offer[] {
    return this.cachedOffers;
  }

  public getOffers() {
    return this.offers;
  }

  public async getOffersFromBlockchain() {
    this.offers = [];
    this.loadingService.show();
    try {
      const offers = await this.swapyProtocol.get('Offers');

      for (const offerEvent of offers){

        const contractVariables = offerEvent.returnValues;
        let constants = ['paybackDays', 'grossReturn'];
        const offerAsset = await this.swapyProtocol.getAssetConstants(contractVariables._assets[0], constants);
        constants = ['value', 'status', 'tokenFuel'];
        const assets = [];
        for (const asset of contractVariables._assets) {
          const assetValues = await this.swapyProtocol.getAssetConstants(asset, constants);
          assets.push(assetValues);
        }
        const totalTokens = assets.map(asset => asset.tokenFuel).reduce((current, total) => Number(current) + Number(total));
        const raisingAmount = assets.map(asset => asset.value).reduce((current, total) => Number(current) + Number(total));
        const offer = {
          raisingAmount: raisingAmount / 100,
          grossReturn: offerAsset.grossReturn / 10000,
          paybackMonths: offerAsset.paybackDays / 30,
          status: assets.map(asset => asset.status),
          averageCollateral: totalTokens / assets.length / Math.pow(10, 18),
          walletAddress: contractVariables._from,
          assetsAddress: contractVariables._assets
        } as any;
        this.offers.push(offer);
      };
      this.cacheOffers(this.offers);
      this.loadingService.hide();
      return this.offers;
    } catch (err) {
      this.loadingService.hide();
      console.log(err);
    }
  }

}
