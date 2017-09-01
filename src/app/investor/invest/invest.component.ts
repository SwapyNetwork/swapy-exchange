import { Component, OnInit } from '@angular/core';
import { InvestService } from './invest.service';
import { Router } from '@angular/router';
import { Invest } from './invest.interface';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css']
})
export class InvestComponent implements OnInit {

  public investment: Invest;
  public offerIndex: number;

  constructor(private investService: InvestService, private router: Router) { }

  ngOnInit() {
  	this.investment = this.investService.getCachedInvestment();
  	if(!this.investment) this.router.navigate(["/investor/offers"]);
  	this.offerIndex = this.investService.getCachedOfferIndex();
  }

  confirmInvestment(){
  	this.investService.addInvest(this.investment).then(data => {
  		console.log(data);
  	}, error => {
  		console.log(error);
  	})
  	
  }

}
