import { Injectable } from '@angular/core';
import { InvestorComponent } from './investor.component';

@Injectable()
export class InvestorService {

  public statistics;

  constructor(/*public investorComponent: InvestorComponent*/) { }

  public refreshStatistics() {
    // this.investorComponent.refreshBalance();
  }

  public setStatistics() {
    // this.statistics = this.investorComponent.getStatistics();
  }

  public getStatistics() {
    // return this.statistics;
  }

}
