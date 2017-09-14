import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../offers/offer.service';
import { Offer } from '../offers/offer/offer.interface';
import { Invest } from '../invest/invest.interface';
import { InvestService } from '../invest/invest.service';
import { OPEN, SOLD, PENDING } from '../../common/models/offerAsset.model';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

  public OPEN: number = 1;
  public SOLD: number = 2;
  public PENDING: number = 3; 
  
  public offer: Offer;

  public assets: boolean[] = [];

  public totalAssetsValue: number = 0;
  public offerIndex: number = 0;
  
  public errorMessages:string[] = [];


  constructor(private offerService: OfferService, private activatedRoute: ActivatedRoute, private router: Router, private investService: InvestService) {}

  ngOnInit() {
    let offers = this.offerService.getCachedOffers();
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      this.offerIndex = params['id'];
      this.offer = offers[this.offerIndex];
      this.offerService.getOfferByUuid(this.offer.uuid).then((data: any) => {
        this.offer = {
          roi: data.offer.offerRoi,
          paybackMonths: data.offer.offerPaybackMonths,
          raisingAmount: data.offer.offerRaisingAmount,
          walletAddress: data.offer.offerWalletAddress,
          uuid: data.offer.offerUuid,
          companyName: data.offer.firstName + " " + data.offer.lastName,
          companyLogo: data.offer.picture,
          companyUuid: data.offer.uuid,
          assets: data.offer.assets
        };
      })
    });
  }

  getSelectedAssets(){
    return this.offer.assets.filter((asset, index) => this.assets[index] == true);
  }

  setTotalAssetsValue(){
    let selectedAssets = this.getSelectedAssets();
    this.totalAssetsValue = selectedAssets.map(asset => asset.value)
                                .reduce((total, current) => (total + current), 0);
  }

  validateInput(){
    this.errorMessages = [];
    if(this.getSelectedAssets().length == 0){
      this.errorMessages.push('Please, select at least one asset.');
    }

    return this.errorMessages.length == 0;

  }

  invest(){
    if(this.validateInput()){
      let offerAssets = this.getSelectedAssets();
      let assets = [];

      for(let offerAsset of offerAssets){
        assets.push({uuid: offerAsset.uuid, value: offerAsset.value});
      }

      let invest: Invest = {
        uuid: null,
        companyId: this.offer.companyUuid,
        companyName: this.offer.companyName,
        offerUuid: this.offer.uuid,
        totalAmount: this.totalAssetsValue,
        roi: this.offer.roi,
        paybackMonths: this.offer.paybackMonths,
        assets: assets
      }

      this.investService.cacheInvestment(invest);
      this.investService.cacheOfferIndex(this.offerIndex);

      this.router.navigate(["investor/invest"]);
    }


  }
}
