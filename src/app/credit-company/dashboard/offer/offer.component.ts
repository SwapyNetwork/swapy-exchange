import { Component, OnInit, Input } from '@angular/core';
import { Offer } from './offer.interface';

@Component({
  selector: 'dashboard-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

	@Input() public offer: Offer;
  @Input() public collapsed: boolean;

  constructor() { }

  ngOnInit() {
  }

  public toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

}
