import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AddOfferService } from '../add-offer/add-offer.service';

@Component({
  selector: 'app-confirm-offer',
  templateUrl: './confirm-offer.component.html',
  styleUrls: ['./confirm-offer.component.css']
})
export class ConfirmOfferComponent implements OnInit {

  public offer:any;

  constructor(private addOfferService: AddOfferService, private router: Router) { }

  ngOnInit() {
    this.offer = this.addOfferService.getCachedOffer();
    if (!this.offer) this.router.navigate(["/credit-company/raise"]);
  }

  confirmOffer() {
    this.addOfferService.addOffer(this.offer).then(
      data => {
        this.offer.uuid = data.offer.uuid;
        this.offer.address = data.offer.address;
        this.addOfferService.cacheOffer(this.offer);
        this.router.navigate(["/credit-company/raise/success"])
      },
      error => {
        console.log(error);
      }
    );
  }

}
