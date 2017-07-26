import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Offer } from './offer/offer.interface';
import { OfferService } from './offer.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
  providers: [ OfferService ]
})
export class OffersComponent implements OnInit {

	public offers: Offer[];
	public errorMessage;
	mode = 'Observable';

  constructor(private offerService: OfferService) { }

  ngOnInit() { 
    this.offerService.getOffers().then(
    	(data:any) => {this.offers = data.offers},
    	error =>  this.errorMessage = <any>error
  	);
  }

}