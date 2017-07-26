import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Offer } from './offer/offer.interface';

import { HttpService } from '../../common/services/http.service';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OfferService {

	constructor(public http: HttpClient, public httpService: HttpService) {}

	getOffers(): Promise<Offer[]> {
		return this.httpService.get("offers");

		// let url:string = environment.api + "offers";

	 //  // don't have the data yet
	 //  return new Promise( (resolve, reject) => {
  //   	let headers = new HttpHeaders();
  //   	headers.set('Content-Type', 'application/json');

		// 	let options = {
		// 		headers: headers
		// 	};

		// 	// send http request
	 //    this.http.get(url, options)
	 //      .subscribe( (data:any) => {
	      	
	 //        resolve(data.offers)
	 //      },
	 //      error => {
	 //      	reject(error);
	 //      });
  // 	});
	}

}