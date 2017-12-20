import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


import { StorageService } from './storage.service';
import { LoadingService } from '../../common/services/loading.service';
import { environment } from '../../../environments/environment';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LogoutService {

  constructor(public http: HttpClient, public storageService: StorageService,
    public loadingService: LoadingService, private router: Router) {}

  logout() {
    this.storageService.clear();
    clearInterval((window as any).listenForAccountChanges);
    this.router.navigate(['/']);
  }

  logoutMetamask() {
    this.storageService.clear();
    clearInterval((window as any).listenForAccountChanges);
    this.router.navigate(['/metamask']);
  }
}
