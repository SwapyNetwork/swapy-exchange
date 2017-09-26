import { Injectable } from '@angular/core';
import { HttpService } from '../../common/services/http.service';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TfaService {
  constructor(public httpService: HttpService) {}

  getQrcode(): Promise<any> {
    return this.httpService.get('2fa/qrcode');
  }

  postOtp(otp): Promise<any> {
    return this.httpService.post('2fa/verify', { otp });
  }

  postOtpAndGetJwt(otp): Promise<any> {
    return this.httpService.post('2fa/verify-jwt', { otp });
  }

}
