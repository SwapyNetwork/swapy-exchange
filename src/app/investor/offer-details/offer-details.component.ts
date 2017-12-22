import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../offers/offer.service';
import { Offer } from '../../common/interfaces/offer.interface';
import { LoadingService } from '../../common/services/loading.service';
import { Invest } from '../invest/invest.interface';
import { InvestService } from '../invest/invest.service';
import {AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION
} from '../../common/interfaces/offer-asset-status.interface';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';


@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public FOR_SALE = FOR_SALE;
  public PENDING_INVESTOR_AGREEMENT = PENDING_INVESTOR_AGREEMENT;
  public PENDING_ETHEREUM_CONFIRMATION = PENDING_ETHEREUM_CONFIRMATION;

  public offer;

  public assets: boolean[] = [];

  public totalAssetsValue = 0;
  public offerIndex = 0;

  public errorMessages: string[] = [];


  constructor(private offerService: OfferService, private activatedRoute: ActivatedRoute,
    private router: Router, private investService: InvestService, private swapyProtocol: SwapyProtocol,
    private loadingService: LoadingService) { }

  ngOnInit() {
    const offers = this.offerService.getCachedOffers();
    if (!offers) {
      this.router.navigate(['/investor/offers']);
    }
    // subscribe to router event
    this.activatedRoute.params.subscribe(async (params: Params) => {
      this.loadingService.show();
      this.offerIndex = params['id'];
      this.offer = offers[this.offerIndex];
      const assets = [];
      for (const assetAddress of this.offer.assetsAddress) {
        const assetObject = await this.swapyProtocol.getAssetConstants(assetAddress, ['value', 'status']);
        const asset = {
          contractAddress: assetAddress,
          value: assetObject.value / 100,
          status: assetObject.status
        } as any;
        assets.push(asset);
      }
      this.offer.assets = assets;
      this.loadingService.hide();
    });
  }

  getSelectedAssets() {
    return this.offer.assets.filter((asset, index) => this.assets[index] === true);
  }

  setTotalAssetsValue() {
    const selectedAssets = this.getSelectedAssets();
    this.totalAssetsValue = selectedAssets.map(asset => asset.value)
      .reduce((total, current) => (total + current), 0);
  }

  validateInput() {
    this.errorMessages = [];
    if (this.getSelectedAssets().length === 0) {
      this.errorMessages.push('Please, select at least one asset.');
    }

    return this.errorMessages.length === 0;

  }

  statusToString(status) {
    let statusString;
    switch (parseInt(status, 10)) {
      case this.AVAILABLE:
        statusString = 'Available';
        break;
      case this.PENDING_OWNER_AGREEMENT:
        statusString = 'Pending agreement';
        break;
      case this.INVESTED:
        statusString = 'Sold';
        break;
      case this.FOR_SALE:
      case this.PENDING_INVESTOR_AGREEMENT:
      case this.RETURNED:
      case this.DELAYED_RETURN:
        statusString = 'Unavailable';
        break;
    }

    return statusString;

  }

  invest() {
    if (this.validateInput()) {

      const invest = {
        walletAddress: this.offer.walletAddress,
        totalAmount: this.totalAssetsValue,
        grossReturn: this.offer.grossReturn,
        paybackMonths: this.offer.paybackMonths,
        assets: this.getSelectedAssets()
      } as any;

      this.investService.cacheInvestment(invest);
      this.investService.cacheOfferIndex(this.offerIndex);

      this.router.navigate(['investor/invest']);
    }
  }
}
