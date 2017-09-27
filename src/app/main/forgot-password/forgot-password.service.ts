import { Injectable } from '@angular/core';
import {HttpService} from '../../common/services/http.service';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ForgotPasswordService {

  constructor(public httpService: HttpService) {}

  retrivePassword(email: string) {
      // We're using Angular HTTP provider to request the service
      return this.httpService.post("retrieve-password", {email: email});
  }

}
