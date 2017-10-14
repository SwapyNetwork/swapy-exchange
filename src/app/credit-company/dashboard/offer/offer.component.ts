import { Component, OnInit, Input } from '@angular/core';
import { Offer } from '../../../common/interfaces/offer.interface';
import { I18nService } from '../../../common/services/i18n.service';
import { OfferService } from './offer.service';
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

  constructor(private investmentAssetService: InvestmentAssetService, private offerService: OfferService,
    private i18nService: I18nService) { }

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

  public agreeInvestment(asset) {
    const ethusd = 340.0;
    const agreementTermsHash = '67e49469e62a9805e43744ec4437a6dcf6c6bc36d6a33be837e95b8d325816ed';
    const value = asset.value / ethusd;

    this.offerService.acceptInvestor(asset).then(data => {
        this.investmentAssetService.agreeInvestment(asset.investorWallet, agreementTermsHash, value);
    }, error => {
      let namespace = "agree-investment";

      this.i18nService.doTranslateList(namespace, error).then( res => {
        this.errorMessages = res; // errorMessages is a list of error strings
      });
    });
  }

}
