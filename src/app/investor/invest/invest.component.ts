import { Component, OnInit } from '@angular/core';
import { InvestService } from './invest.service';
import { Router } from '@angular/router';
import { Invest } from './invest.interface';
import { SuccessfulInvestmentService } from './../successful-investment/successful-investment.service';
import { InvestorComponent } from './../investor.component';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css']
})
export class InvestComponent implements OnInit {

  public investment: Invest;
  public offerIndex: number;

  constructor(private investService: InvestService, private router: Router, private successfulInvestmentService: SuccessfulInvestmentService, private investorComponent: InvestorComponent ) { }

  ngOnInit() {
    this.investment = this.investService.getCachedInvestment();
    if(!this.investment) this.router.navigate(['/investor/offers']);
    this.offerIndex = this.investService.getCachedOfferIndex();
  }

  confirmInvestment() {
    this.successfulInvestmentService.cleanMessages();
    const body = {
      companyUuid: this.investment.companyUuid,
      offerUuid: this.investment.offerUuid,
      assets: this.investment.assets,
    };
    this.investService.addInvest(body).then(data => {
      this.investService.cacheInvestment(data.investment);
      this.investorComponent.refreshStatusBar();
      this.successfulInvestmentService.cacheSuccessfulMessages(data);
      this.router.navigate(['investor/invest/success']);
    }, error => {

      this.successfulInvestmentService.cacheErrors(error.error);
      this.router.navigate(['investor/invest/success']);
    });
  }

}
