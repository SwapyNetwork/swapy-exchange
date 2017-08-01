import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AddOfferService } from '../add-offer/add-offer.service';

@Component({
  selector: 'app-successful-offer',
  templateUrl: './successful-offer.component.html',
  styleUrls: ['./successful-offer.component.css']
})
export class SuccessfulOfferComponent implements OnInit {

  public offer;

  constructor(private addOfferService: AddOfferService, private router: Router) { }

  ngOnInit() {
    this.offer = this.addOfferService.getCachedOffer();
  }

}
