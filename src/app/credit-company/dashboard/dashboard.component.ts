import { Component, OnInit } from '@angular/core';
import { OfferService } from './offer/offer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public offers;

  constructor(private offerService: OfferService) { }

  ngOnInit() {
    this.offerService.getMyOffers().then(
      (data:any) => {
        this.offers = data.offers;
      },
      (error:any) => {
        console.log(error)
      }
    );
  }

}
