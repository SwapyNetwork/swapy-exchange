import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UPORT, METAMASK } from '../../common/interfaces/user-response.interface';

import { I18nService } from '../../common/services/i18n.service';
import { StorageService } from '../../common/services/storage.service';
import { LogoutService } from '../../common/services/logout.service';

const env = require('../../../../env.json');

@Component({
  selector: 'app-select-login',
  templateUrl: './select-login.component.html',
  styleUrls: ['./select-login.component.css']
})
export class SelectLoginComponent implements OnInit {

  public agreedToTerms;
  public errorMessages: string[] = [];
  public env = env;
  public METAMASK = METAMASK;
  public UPORT = UPORT;

  constructor(
    private i18nService: I18nService,
    private router: Router,
    private storageService: StorageService,
  ) {}

  ngOnInit() {
    this.storageService.remove('uPort');
  }

  selectLogin(loginType) {
    if (this.agreedToTerms === true) {
      if (Number(loginType) === UPORT) { this.storageService.setItem('uPort', true) };
      this.storageService.setItem('acceptedTerms', this.agreedToTerms);
      this.router.navigate([this.solveRoute(loginType)]);
    } else {
      this.errorMessages.push('You have to agree to Swapy\'s Terms of Service and Privacy Policy to proceed.');
    }
  }

  private solveRoute(loginType: number) {
    switch (loginType) {
      case UPORT:
        return '/uport';
      case METAMASK:
        return '/metamask';
      default:
        return '/';
    }
  }

}
