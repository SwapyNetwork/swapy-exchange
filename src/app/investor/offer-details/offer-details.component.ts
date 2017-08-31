import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../offers/offer.service';
import { Offer } from '../offers/offer/offer.interface';
import { Invest } from '../invest/invest.interface';
import { InvestService } from '../invest/invest.service';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

  public offer: Offer;

  public assets: boolean[] = [];

  public totalAssetsValue: number = 0;
  public offerIndex = 0;

  constructor(private offerService: OfferService, private activatedRoute: ActivatedRoute, private router: Router, private investService: InvestService) {}

  ngOnInit() {
    let offers = this.offerService.getCachedOffers();
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      this.offerIndex = params['id'];
      this.offer = offers[this.offerIndex];
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

  invest(){

    let offerAssets = this.getSelectedAssets();
    let assets = [];

    for(let offerAsset of offerAssets){
      assets.push({uuid: offerAsset.uuid, value: offerAsset.value});
    }

    let invest: Invest = {
      uuid: null,
      companyId: this.offer.companyId,
      companyName: this.offer.companyName,
      offerUuid: this.offer.uuid,
      totalAmount: this.totalAssetsValue,
      roi: this.offer.roi,
      paybackMonths: this.offer.paybackMonths,
      assets: assets,
      investedIn: null
    }

    this.investService.cacheInvestment(invest, this.offerIndex);

    this.router.navigate(["investor/invest"]);


  }
}
