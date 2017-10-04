import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginModel } from '../login/login.model';
import { SignUpModel } from './sign-up.model';
import { LoginResponseModel } from '../login/login-response.model';

import { LoginService } from '../login/login.service';
import { LoadingService } from '../../common/services/loading.service';
import { environment } from '../../../environments/environment';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SignUpService {

  constructor(public http: HttpClient, public loginService: LoginService, public loadingService: LoadingService) {}

  signUp(signUp:SignUpModel) {
    let url:string = environment.api + "sign-up";

    // don't have the data yet
    return new Promise( (resolve, reject) => {
      let headers = new HttpHeaders();
      headers.set('Content-Type', 'application/json');

      let options = {
        headers: headers,
        withCredentials: true
      };

      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.loadingService.show();
      this.http.post(url, signUp, options)
        // .map(res => res.json())
        .subscribe( (data:LoginResponseModel) => {

          //now we have the users info, let's save it in the Storage
          let body = {email: signUp.email, password: signUp.password};
          this.loginService.login(body).then(
            loginData => {
              this.loadingService.hide();
              resolve(loginData);
            },
            error => {
              this.loadingService.hide();
              reject(error);
            }
          );

        },
        error => {
          this.loadingService.hide();
          reject(error);
        });
    });
  }

}
