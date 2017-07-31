import { Injectable } from '@angular/core';
import { HttpService } from '../../common/services/http.service';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AddOfferService {

  private cachedOffer:any;

	constructor(public httpService: HttpService) {}

	addOffer(offer): Promise<any> {
		return this.httpService.post("offers/add", offer);
	}

  cacheOffer(offer) {
    this.cachedOffer = offer;
  }

  getCachedOffer(){
    return this.cachedOffer;
  }

}
