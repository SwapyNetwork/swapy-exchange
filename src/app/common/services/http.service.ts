import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';

import { LoadingService } from '../../common/services/loading.service';
import { environment } from '../../../environments/environment';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HttpService {
  private options: any;

  constructor(public http: HttpClient, public router: Router,
    public storageService: StorageService, public loadingService: LoadingService) {}

  private appendHeaders() {
    const accessToken = this.storageService.getItem('accessToken');
    if (accessToken) {
      return new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`);
    } else {
      return new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
    }
  }

  get(endpoint) {
    const headers = this.appendHeaders();
    return new Promise( (resolve, reject) => {
      // We're using Angular HTTP provider to request services
      this.loadingService.show();
      this.http.get(this.url(endpoint), { headers, withCredentials: true }).subscribe(
        data => {
          this.loadingService.hide();
          resolve(data);
        },
        error => {
          this.loadingService.hide();
          this.handleError(reject, error)
        }
      );
    });

  }

  post(endpoint, body) {
    const headers = this.appendHeaders();
    return new Promise( (resolve, reject) => {
      this.loadingService.show();
      // We're using Angular HTTP provider to request services
      this.http.post(this.url(endpoint), body, { headers, withCredentials: true }).subscribe(
        data => {
          this.loadingService.hide();
          resolve(data);
        },
        error => {
          this.loadingService.hide();
          this.handleError(reject, error);
        }
      );
    });
  }

  put(endpoint, body) {
    const headers = this.appendHeaders();
    return new Promise( (resolve, reject) => {
      this.loadingService.show();
      // We're using Angular HTTP provider to request services
      this.http.put(this.url(endpoint), body, { headers, withCredentials: true }).subscribe(
        data => {
          this.loadingService.hide();
          resolve(data);
        },
        error => {
          this.loadingService.hide();
          this.handleError(reject, error);
        }
      );
    });
  }

  private handleError(reject, err) {
    const error = err.error;
    if (error.length === 0) {
      err.error = [{code: 'UNK-E01', message: err.status + ' ' + err.statusText, error: error}];
      reject(err);
    } else if (error[0].unauthenticated === true) {
      /** @todo Find a way to communicate the user he is being redirected */
      this.router.navigate(['/']);
    } else {
      reject(err);
    }
  }

  private url(endpoint) {
    const url: string = environment.api + endpoint;
    return url;
  }
}
