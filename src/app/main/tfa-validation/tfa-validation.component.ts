import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TfaService } from '../tfa-setup/tfa.service';
import { StorageService } from '../../common/services/storage.service';
import { INVESTOR, CREDIT_COMPANY } from '../../common/interfaces/user-response.interface';

@Component({
  selector: 'app-tfa-validation',
  templateUrl: './tfa-validation.component.html',
  styleUrls: ['./tfa-validation.component.css']
})
export class TfaValidationComponent implements OnInit {
  public otp: number;

  constructor(private tfaService: TfaService, private router: Router, private storageService: StorageService) { }

  ngOnInit() {
  }

  validateOtp() {
    const user = this.storageService.getItem('user');
    if (user.tfa === true) {
      this.tfaService.postOtpAndGetJwt(this.otp).then(res => {
        this.storageService.setItem('accessToken', res.accessToken);
        this.router.navigate([this.solveRoute(user.type)]);
      }, err => console.log(err));
    } else {
      this.tfaService.postOtp(this.otp).then(res => {
        this.router.navigate([this.solveRoute(user.type)]);
      }, err => console.log(err));
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
