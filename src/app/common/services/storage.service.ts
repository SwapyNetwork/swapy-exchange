import { Injectable } from '@angular/core';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StorageService {

	constructor() {}

	public setItem(name, data) {
		if (data !== null && typeof data === 'object') {
			return localStorage.setItem(name, JSON.stringify(data))
		} else {
			return localStorage.setItem(name, data)
		}
	}

	public getItem(name) {
		let data = {};
		data[name] = localStorage.getItem(name);
		try {
		   return JSON.parse(data[name]);
		} catch(e){
		   return data[name];
		}
	}

	public remove(name) {
		return localStorage.removeItem(name);
	}

}