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
  public asset1: boolean = false;
  public asset2: boolean = false;
  public asset3: boolean = false;
  public asset4: boolean = false;
  public asset5: boolean = false;

  constructor(private offerService: OfferService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    let offers = this.offerService.getCachedOffers();
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      let offerIndex = params['id'];
      this.offer = offers[offerIndex];
    });
  }

  invest(){
    let assets = [this.asset1, this.asset2, this.asset3, this.asset4, this.asset5];
    console.log(assets);
  }
}
