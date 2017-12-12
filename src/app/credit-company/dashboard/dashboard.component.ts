import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { WalletService } from '../../common/services/wallet.service';
import { Web3Service } from '../../common/services/web3.service';
import { LoadingService } from '../../common/services/loading.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AGREE_INVESTMENT, TRANSFER_FUNDS, CREATE_OFFER } from '../../common/interfaces/events.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public offers;

  constructor(
    private walletService: WalletService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private toastr: ToastsManager, vcr: ViewContainerRef,
    private swapyProtocol: SwapyProtocol,
    private errorLogService: ErrorLogService) {
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.updateOffers();
  }

  private async getBlockTimestamp(blockHash: string) {
    return (await this.web3Service.getInstance().eth.getBlock(blockHash)).timestamp;
  }

  private setOfferDetails(newOffer, assetValues, numberOfAssets) {
    newOffer.paybackMonths = assetValues[3] / 30;
    newOffer.raisingAmount = assetValues[2] * numberOfAssets / 100;
    newOffer.grossReturn = assetValues[4] / 10000;
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
    return {
      contractAddress: offer.returnValues._assets[index],
      investorWallet: assetValues[6],
      status: assetValues[5],
      value: assetValues[2] / 100
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
    this.loadingService.show();
    const offers = await this.swapyProtocol.get('Offers')
      .filter(offer => offer.returnValues._from.toLowerCase() === this.walletService.getWallet().address.toLowerCase());

    const promises = [];
    offers.forEach(offer => {
      promises.push(this.factoryOffer(offer));
    });

    const resolvedOffers = await Promise.all(promises);
    this.offers = resolvedOffers;
    this.loadingService.hide();
  }
}
