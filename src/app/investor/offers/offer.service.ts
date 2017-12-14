import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Offer } from '../../common/interfaces/offer.interface';

import { HttpService } from '../../common/services/http.service';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OfferService {

  private cachedOffers: Offer[];

  constructor(public http: HttpClient, public httpService: HttpService) {}

  public cacheOffers(offers: Offer[]) {
    this.cachedOffers = offers;
  }

  public getCachedOffers(): Offer[] {
    return this.cachedOffers;
  }

}
