import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginModel } from './login.model';
import { LoginResponseModel } from './login-response.model';

import { StorageService } from '../../common/services/storage.service';
import { LoadingService } from '../../common/services/loading.service';
import { environment } from '../../../environments/environment';
import { Web3Service } from '../../common/services/web3.service';


/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoginService {

  constructor(public http: HttpClient, public storageService: StorageService,
    public loadingService: LoadingService, public web3Service: Web3Service) {}

  login(login: LoginModel) {}
}
