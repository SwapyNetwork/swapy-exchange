import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../offers/offer.service';
import { Offer } from '../../common/interfaces/offer.interface';
import { Invest } from '../invest/invest.interface';
import { InvestService } from '../invest/invest.service';
import {AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED,
  RETURNED, DELAYED_RETURN
} from '../../common/interfaces/offerAssetStatus.interface';
import { InvestmentAssetProtocolService as AssetService } from '../../common/services/protocol/investment-asset.service';


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

  public offer: Offer;

  public assets: boolean[] = [];

  public totalAssetsValue: number = 0;
  public offerIndex: number = 0;

  public errorMessages: string[] = [];


  constructor(private offerService: OfferService, private activatedRoute: ActivatedRoute,
    private router: Router, private investService: InvestService, private assetService: AssetService) { }

  ngOnInit() {
    let offers = this.offerService.getCachedOffers();
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      this.offerIndex = params['id'];
      this.offer = offers[this.offerIndex];
      const assets = [];
      for ( const assetAddress of this.offer.assets) {
        console.log(assetAddress);
        const assetContract = this.assetService.getContract(assetAddress);
        const constants = ['fixedValue', 'status'];
        this.assetService.getConstants(assetAddress, constants).then((assetObject) => {
          const asset = {
            value: assetObject.fixedValue / 100,
            status: assetObject.status
          } as any;
          assets.push(asset);
          this.offer.assets = assets;
        });

      }
      // this.offerService.getOfferByUuid(this.offer.uuid).then((data: any) => {
      //   this.offer = {
      //     roi: data.offer.offerRoi,
      //     paybackMonths: data.offer.offerPaybackMonths,
      //     raisingAmount: data.offer.offerRaisingAmount,
      //     walletAddress: data.offer.offerWalletAddress,
      //     contractAddress: data.offer.offerContractAddress,
      //     uuid: data.offer.offerUuid,
      //     companyName: data.offer.firstName + ' ' + data.offer.lastName,
      //     companyLogo: data.offer.picture,
      //     companyUuid: data.offer.uuid,
      //     assets: data.offer.assets,
      //     createdOn: data.offer.createdOn,
      //   };
      // })
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
    let statusString ='';
    // switch (status) {
    //   case this.TX_CREATION_PENDING:
    //     statusString = 'Pending Ethereum confirmation';
    //     break;
    //   case this.TX_CREATED:
    //     statusString = 'Available';
    //     break;
    //   case this.LOCKED:
    //   case this.TX_AGREEMENT_PENDING:
    //   case this.TX_AGREED:
    //   case this.TX_INVEST_PENDING:
    //     statusString = 'Pending confirmation';
    //     break;
    //   case this.TX_INVESTED:
    //     statusString = 'Sold';
    //     break;
    // }

    return statusString;

  }

  invest() {
    if (this.validateInput()) {
      let offerAssets = this.getSelectedAssets();
      let assets = [];

      for (const offerAsset of offerAssets) {
        assets.push({ uuid: offerAsset.uuid, value: offerAsset.value });
      }

      const invest: Invest = {
        uuid: null,
        companyUuid: this.offer.companyUuid,
        companyName: this.offer.companyName,
        offerContractAddress: this.offer.contractAddress,
        offerUuid: this.offer.uuid,
        totalAmount: this.totalAssetsValue,
        roi: this.offer.roi,
        paybackMonths: this.offer.paybackMonths,
        investedIn: null,
        assets: assets
      }

      this.investService.cacheInvestment(invest);
      this.investService.cacheOfferIndex(this.offerIndex);

      this.router.navigate(['investor/invest']);
    }


  }
}
