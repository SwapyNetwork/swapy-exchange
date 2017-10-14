import { Component, OnInit, Input } from '@angular/core';
import { Offer } from '../../../common/interfaces/offer.interface';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../../common/services/protocol/investment-asset.service';
import { OPEN, SOLD, PENDING } from '../../../common/interfaces/offerAssetStatus.interface';

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

  constructor(private investmentAsset: InvestmentAssetService) { }

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

  // public agreeInvestment(offer) {
  //   this.investmentAsset.agreeInvestment();
  // }

}
