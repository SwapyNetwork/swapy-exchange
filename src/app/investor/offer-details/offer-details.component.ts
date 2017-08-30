import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../offers/offer.service';
import { Offer } from '../offers/offer/offer.interface';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

  public offer: Offer;

  public assets: boolean[] = [];

  public totalAssetsValue: number = 0;

  constructor(private offerService: OfferService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    let offers = this.offerService.getCachedOffers();
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      let offerIndex = params['id'];
      this.offer = offers[offerIndex];
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

  }
}
