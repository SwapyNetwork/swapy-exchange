import { Component, OnInit, Input } from '@angular/core';
import { Offer } from './offer.interface';
import { OPEN, SOLD, PENDING } from '../../../common/models/offerAsset.model';

@Component({
  selector: 'dashboard-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  public OPEN = OPEN;
  public SOLD = SOLD;
  public PENDING = PENDING;

	@Input() public offer: Offer;
  @Input() public collapsed: boolean;

  constructor() { }

  ngOnInit() {
  }

  public calculatePaybackDate(asset) {
    const paybackDate = new Date(asset.investedIn);
    paybackDate.setMonth(paybackDate.getMonth() + this.offer.paybackMonths);
    return paybackDate;
  }

  public toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

}
