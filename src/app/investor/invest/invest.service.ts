import { Injectable } from '@angular/core';

import { Invest } from './invest.interface';

import { HttpService } from '../../common/services/http.service';


@Injectable()
export class InvestService {

	private cachedInvest: Invest;

	public cachedOfferIndex: number;

  constructor(public httpService: HttpService) { }

  public cacheInvestment(invest: Invest, offerIndex: number){
  	this.cachedInvest = invest;
  	this.cachedOfferIndex = offerIndex;
  }

  public getCachedInvestment(): Invest {
  	return this.cachedInvest;
  }

  public getCachedOfferIndex(): number{
  	return this.cachedOfferIndex;
  }

  public addInvest(invest): Promise<any> {
  	return this.httpService.post("invest/add", invest);
  }

}
