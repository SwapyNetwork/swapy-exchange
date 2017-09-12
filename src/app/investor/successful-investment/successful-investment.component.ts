import { Component, OnInit } from '@angular/core';
import { SuccessfulInvestmentService } from './../successful-investment/successful-investment.service';
import { InvestService } from './../invest/invest.service';

@Component({
  selector: 'app-successful-investment',
  templateUrl: './successful-investment.component.html',
  styleUrls: ['./successful-investment.component.css']
})
export class SuccessfulInvestmentComponent implements OnInit {

	public successfulMessage :string;
	public errorsMessages :string;
	private offerIndex :number;

  constructor(private successfulInvestmentService: SuccessfulInvestmentService, private investService: InvestService ) { }

  ngOnInit() {
  	this.successfulMessage = this.successfulInvestmentService.getSuccessfulMessages();
  	this.errorsMessages = this.successfulInvestmentService.getErrorsMessages();
  	this.offerIndex = this.investService.getCachedOfferIndex();
  }

}
