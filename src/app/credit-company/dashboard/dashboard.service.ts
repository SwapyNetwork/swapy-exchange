import { Injectable } from '@angular/core';
import { Web3Service } from '../../common/services/web3.service';
import { LoadingService } from '../../common/services/loading.service';
import { WalletService } from '../../common/services/wallet.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { StorageService } from '../../common/services/storage.service';
import { PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';
import { VALUE, PAYBACKDAYS, GROSSRETURN, STATUS,
  INVESTOR, TOKENFUEL, INVESTEDAT } from '../../common/interfaces/asset-parameters.interface';

@Injectable()
export class DashboardService {

  public offers;
  public assets;
  public selectedAssets;

  constructor(
    private walletService: WalletService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private storageService: StorageService,
    private swapyProtocol: SwapyProtocol,
  ) { }

  public getCachedOffers() {
    return this.offers;
  }

  private async getBlockTimestamp(blockHash: string) {
    return (await this.web3Service.getInstance().eth.getBlock(blockHash)).timestamp;
  }

  private setOfferDetails(newOffer, assetValues, numberOfAssets) {
    newOffer.paybackMonths = assetValues[PAYBACKDAYS] / 30;
    newOffer.raisingAmount = assetValues[VALUE] * numberOfAssets / 100;
    newOffer.grossReturn = assetValues[GROSSRETURN] / 10000;
  }

  private async getAssetValues(assets: any[]): Promise<any[]> {
    const promises = [];
    assets.forEach(asset => {
      promises.push(this.swapyProtocol.getAsset(asset));
    });

    return Promise.all(promises);
  }

  private async buildNewOffer(offer) {
    const timestamp = await this.getBlockTimestamp(offer.blockHash);

    return {
      assets: [],
      companyAddress: offer.returnValues._from,
      createdOn: (new Date(timestamp * 1000)).toISOString(),
      paybackMonths: 0,
      raisingAmount: 0,
      grossReturn: 0,
      walletAddress: offer.returnValues._from
    };
  }

  private buildNewAsset(offer, assetValues, index) {
    const storedStatus = this.storageService.getItem(offer.returnValues._assets[index]);
    let status;
    if (storedStatus === null || storedStatus !== Number(assetValues[STATUS])) {
      status = Number(assetValues[STATUS]);
    } else {
      status = PENDING_ETHEREUM_CONFIRMATION;
    }
    return {
      contractAddress: offer.returnValues._assets[index],
      investorAddress: assetValues[INVESTOR],
      status,
      value: assetValues[VALUE] / 100,
      grossReturn: assetValues[GROSSRETURN] / 10000,
      investedAt: assetValues[INVESTEDAT] !== '0' ?
        (new Date(assetValues[INVESTEDAT] * 1000)).toISOString() : null,
      token: assetValues[TOKENFUEL] / Math.pow(10, 18),
      paybackMonths: assetValues[PAYBACKDAYS] / 30,
      selected: 0      
    };
  }

  private async factoryOffer(offer) {
    const newOffer = await this.buildNewOffer(offer);

    const assets = await this.getAssetValues(offer.returnValues._assets);

    assets.forEach((assetValues, index) => {
      newOffer.assets.push(this.buildNewAsset(offer, assetValues, index));
      if (!newOffer.raisingAmount) {
        this.setOfferDetails(newOffer, assetValues, offer.returnValues._assets.length);
      }
    });

    return newOffer;
  }

  async updateOffers() {
    const offers = await this.swapyProtocol.get('Offers')
      .filter(offer => offer.returnValues._from.toLowerCase() === this.walletService.getWallet().address.toLowerCase());

    const promises = [];
    offers.forEach(offer => {
      promises.push(this.factoryOffer(offer));
    });
    this.offers = await Promise.all(promises);
    this.assets = [];
    this.offers.forEach(offer => {
      this.assets = this.assets.concat(offer.assets);
    });
    return this.offers;
  }

  public getAssets() {
    return this.assets;
  }

  public setSelectedAssets(assets) {
    this.selectedAssets = assets;
  }
}
