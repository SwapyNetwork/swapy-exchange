import { Injectable } from '@angular/core';

import { Invest } from './invest.interface';

import { HttpService } from '../../common/services/http.service';


@Injectable()
export class InvestService {

	private cachedInvest: Invest;

  constructor(public httpService: HttpService) { }

  public cacheInvestment(invest: Invest){
  	this.cachedInvest = invest;
  }

  public getCachedInvestment(): Invest {
  	return this.cachedInvest;
  }

  public addInvest(invest): Promise<any> {
  	return this.httpService.post("invest/add", invest);
  }

}
