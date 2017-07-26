import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/map';

import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LogoutService {

	constructor(public http: HttpClient, public storageService: StorageService) {}

	logout() {
		let url:string = environment.api + "login/logout";

	  // don't have the data yet
	  return new Promise( (resolve, reject) => {
	  	let headers = new HttpHeaders();
    	headers.set('Content-Type', 'application/json');

			let options = {
				headers: headers
			};

	    // We're using Angular HTTP provider to request the data,
	    // then on the response, it'll map the JSON data to a parsed JS object.
	    // Next, we process the data and resolve the promise with the new data.
	    this.http.get(url, options).subscribe(
	    	data => {
	      	// user logged out so we will remove him from the NativeStorage
	    		this.storageService.remove('user');
	        resolve(data);
	      },
	      error => {
	      	reject(error);
	      }
      );

  	});
	}

}