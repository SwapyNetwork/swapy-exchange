import { Component, OnInit, Input } from '@angular/core';
import { Offer } from '../../../common/interfaces/offer.interface'
import { AVAILABLE } from '../../../common/interfaces/offer-asset-status.interface';

@Component({
  selector: 'offer-card',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {
  public AVAILABLE = AVAILABLE;

  @Input() public offer: any;
  @Input() public offerIndex: number;

  constructor() { }

  ngOnInit() { }

  public availableAssets() {
  	return this.offer.status.filter(status => status == AVAILABLE).length;
  }

}
