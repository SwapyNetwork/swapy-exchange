import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TfaService } from '../tfa-setup/tfa.service';
import { StorageService } from '../../common/services/storage.service';
import { I18nService } from '../../common/services/i18n.service';
import { INVESTOR, CREDIT_COMPANY } from '../../common/interfaces/user-response.interface';

@Component({
  selector: 'app-tfa-setup',
  templateUrl: './tfa-setup.component.html',
  styleUrls: ['./tfa-setup.component.css']
})
export class TfaSetupComponent implements OnInit {
  public qrcode;

  constructor(private tfaService: TfaService, private router: Router,
    private storageService: StorageService) { }

  ngOnInit() {
    this.tfaService.getQrcode().then(
      (data: any) => {
        this.qrcode = data.qrcode;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  skipTfa() {
    const user = this.storageService.getItem('user');
    this.router.navigate([this.solveRoute(user.type)]);
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
