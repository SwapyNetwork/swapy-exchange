import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { TfaService } from '../tfa-setup/tfa.service';
import { StorageService } from '../../common/services/storage.service';
import { I18nService } from '../../common/services/i18n.service';
import { INVESTOR, CREDIT_COMPANY } from '../../common/interfaces/user-response.interface';

@Component({
  selector: 'app-tfa-validation',
  templateUrl: './tfa-validation.component.html',
  styleUrls: ['./tfa-validation.component.css']
})
export class TfaValidationComponent implements OnInit {
  public otp: number;
  public errorMessages: string[] = [];

  public otpMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '',
    allowDecimal: false,
    integerLimit: 6,
  });

  constructor(private tfaService: TfaService, private router: Router,
    private storageService: StorageService, private i18nService: I18nService) { }

  ngOnInit() {
  }

  validateOtp() {
    const user = this.storageService.getItem('user');
    if (user.tfa === true) {
      this.tfaService.postOtpAndGetJwt(this.otp).then(res => {
        this.storageService.setItem('accessToken', res.accessToken);
        this.router.navigate([this.solveRoute(user.type)]);
      }, err => {
        const namespace = 'tfa';

        this.i18nService.doTranslateList(namespace, err.error).then( res => {
          this.errorMessages = res; // errorMessages is a list of error strings
        });
      });
    } else {
      this.tfaService.postOtp(this.otp).then(res => {
        this.router.navigate([this.solveRoute(user.type)]);
      }, err => {
        const namespace = 'tfa';

        this.i18nService.doTranslateList(namespace, err.error).then( res => {
          this.errorMessages = res; // errorMessages is a list of error strings
        });
      });
    }
  }

  private solveRoute(userType: number) {
    switch (userType) {
      case INVESTOR:
        return '/investor';
      case CREDIT_COMPANY:
        return '/credit-company';
      default:
        return '/';
    }
  }
}
