import { Component, OnInit } from '@angular/core';
import { InvestService } from './invest.service';
import { Router } from '@angular/router';
import { Invest } from './invest.interface';
import { SuccessfulInvestmentService } from './../successful-investment/successful-investment.service';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css']
})
export class InvestComponent implements OnInit {

  public investment: Invest;
  public offerIndex: number;

  constructor(private investService: InvestService, private router: Router, private successfulInvestmentService: SuccessfulInvestmentService) { }

  ngOnInit() {
  	this.investment = this.investService.getCachedInvestment();
  	if(!this.investment) this.router.navigate(["/investor/offers"]);
  	this.offerIndex = this.investService.getCachedOfferIndex();
  }

  confirmInvestment(){
    this.successfulInvestmentService.cleanMessages();
  	this.investService.addInvest(this.investment).then(data => {
  		this.investService.cacheInvestment(data.investment);
      console.log(data);
      this.successfulInvestmentService.cacheSuccessfulMessages(data);
      // @todo Show message in case not all of the assets were available.
      // resolve({ code: "INVADD-E07", message: availableAssetsLength + " out of " + selectedAssetsLength + " assets was available for investment.", investment: params}); -- from User.addInvestment() in backend

      this.router.navigate(["investor/invest/success"]);
    }, error => {
      // @todo Implement error page when asset is not available anymore.
      // reject({ code: "INVADD-E06", message: "Asset not available for investment", investment: params}); -- from User.addInvestment() in backend

      console.log(error);
      this.successfulInvestmentService.cacheErrors(error.error);
      this.router.navigate(["investor/invest/success"]);
  	})
  	
  }

}
