import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { I18nService } from '../../common/services/i18n.service';
import { StorageService } from '../../common/services/storage.service';
import { LogoutService } from '../../common/services/logout.service';
import { WalletService } from '../../common/services/wallet.service';
import { UportService } from '../../common/services/uport.service';
import { UserResponseInterface, INVESTOR, CREDIT_COMPANY } from '../../common/interfaces/user-response.interface';


const env = require('../../../../env.json');

@Component({
  selector: 'app-uport-login',
  templateUrl: './uport-login.component.html',
  styleUrls: ['./uport-login.component.css']
})
export class UportLoginComponent implements OnInit {
  public errorMessages: string[] = [];
  public env = env;

  public INVESTOR = INVESTOR;
  public CREDIT_COMPANY = CREDIT_COMPANY;

  constructor(
    private i18nService: I18nService,
    private router: Router,
    private storageService: StorageService,
    public logoutService: LogoutService,
    public walletService: WalletService,
    public uportService: UportService,
  ) {}

  async ngOnInit() {
    await this.uportService.newUportConnection();
    this.uportLogin();
  }

  async uportLogin() {
    try {
      const user = await this.uportService.getUport().requestCredentials({
        requested: ['name', 'phone', 'country', 'avatar'],
        notifications: true // We want this if we want to recieve credentials
      });

      if (user) {
        user.avatar = user.avatar ? user.avatar.uri : 'assets/img/unknown-user.png';
        this.storageService.setItem('user', user);
        (window as any).uportWeb3 = this.uportService.getWeb3();
      }
    } catch (error) {
      console.log(error);
    }

  }

  login(userType) {
    const user = this.storageService.getItem('user');
    if (user) {
      user.type = userType;
      this.storageService.setItem('user', user);
      this.walletService.getCurrentAccount();
      this.router.navigate([this.solveRoute(userType)]);
    } else {
      this.errorMessages = ['You have to connect your uPort to proceed. Check your phone to see if there\'s any uPort request there'];
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
