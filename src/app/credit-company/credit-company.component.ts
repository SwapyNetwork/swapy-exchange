import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {CreditCompanyService} from './credit-company.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'credit-company-root',
  templateUrl: './credit-company.component.html',
  styleUrls: ['./credit-company.component.css']
})
export class CreditCompanyComponent implements OnInit {
  title = 'credit-company';

  public amountRequested;
  public amountRaised;
  public offersLength;

  constructor(private creditCompanyService: CreditCompanyService) {};

  ngOnInit() { /**@todo Not only on ngOnInit - Refresh everytime that a raise is done*/
  this.creditCompanyService.getMyOffersInfos().then(
    (data: any) => {
      this.amountRequested = data.amountRequested;
      this.amountRaised = data.amountRaised;
      this.offersLength = data.offersLength;
    },
    (error: any) => {
      console.log(error);
    });
  };
}
