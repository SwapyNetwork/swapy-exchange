import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HttpService {

	private headers: HttpHeaders;
	private options: any;

	constructor(public http: HttpClient, public router: Router) {
    this.headers = new HttpHeaders();
    this.headers.set('Content-Type', 'application/json');
    this.headers.set('Accept', 'application/json');

    this.options = {
    	headers: this.headers
    };
	}

	get(endpoint) {
	  return new Promise( (resolve, reject) => {
	    // We're using Angular HTTP provider to request services
	    this.http.get(this.url(endpoint), this.options).subscribe(
	    	data => resolve(data),
	      error => this.handleError(reject, error.error)
      );
  	});

	}

	post(endpoint, body) {

	  return new Promise( (resolve, reject) => {
	    // We're using Angular HTTP provider to request services
	    this.http.post(this.url(endpoint), body, this.options).subscribe(
	    	data => resolve(data),
	      error => this.handleError(reject, error.error)
      );
  	});

	}

	private handleError(reject, error) {
  	if (error.unauthenticated === true) {
  		/** @todo Find a way to communicate the user he is being redirected */
  		this.router.navigate(["/"]);
  	} else {
  		reject(error);
  	}
	}

	private url(endpoint) {
		let url:string = environment.api + endpoint;
		return url;
	}

}