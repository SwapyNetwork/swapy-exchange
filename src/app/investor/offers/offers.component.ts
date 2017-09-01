import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Offer } from './offer/offer.interface';
import { OfferService } from './offer.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

	public offers: Offer[] = [];
	public errorMessage;
	mode = 'Observable';

  constructor(private offerService: OfferService) { }

  ngOnInit() {
    this.offerService.getOffers().then(
    	(data:any) => {

        for (var o of data.offers) {
          this.offers.push({
            roi: o.offerRoi,
            paybackMonths: o.offerPaybackMonths,
            raisingAmount: o.offerRaisingAmount,
            walletAddress: o.offerWalletAddress,
            uuid: o.offerUuid,
            companyName: o.firstName + " " + o.lastName,
            companyLogo: o.picture,
            companyUuid: o.uuid,
            assets: o.assets
          });
        }

        this.offerService.cacheOffers(this.offers);

      },
    	error =>  this.errorMessage = <any>error
  	);
  }

}
