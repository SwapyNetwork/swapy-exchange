import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { LoginResponseModel } from './login-response.model';
import { UserResponseInterface, INVESTOR, CREDIT_COMPANY } from '../../common/interfaces/user-response.interface';

import { I18nService } from '../../common/services/i18n.service';
import { Web3Service } from '../../common/services/web3.service';
import { ExchangeProtocolService } from '../../common/services/protocol/exchange.service';
import { WalletService } from '../../common/services/wallet.service';
import { LogoutService } from '../../common/services/logout.service';
import { Wallet } from '../../common/interfaces/wallet.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string = '';
  public password: string = '';
  public errorMessages: string[] = [];
  private web3;

  constructor(private loginService: LoginService,
    private i18nService: I18nService,
    private router: Router,
    private web3Service: Web3Service,
    private protocolService: ExchangeProtocolService,
    private walletService: WalletService,
    public logoutService: LogoutService
  ) { }

  ngOnInit() {
    this.web3Service.init();
    this.web3 = this.web3Service.getInstance();
    this.walletService.delete();
  }

  login() {
    /** @todo frontend validations */
    this.errorMessages = [];

    let body = {
      email: this.email,
      password: this.password
    };

    this.loginService.login(body).then(
      // Successful responses call the first callback.
      (data: LoginResponseModel) => {

        const wallet: Wallet = this.walletService.getWallet();
        if (wallet) {
          this.router.navigate([this.solveRoute(data.user.type, data.user.tfa)]);
        } else {
          this.errorMessages.push('Local wallet not found. Please log in from the device you signed up. Decentralized backup to be done in a later version.'); // @todo Improve error message.
          this.logoutService.logout();
        }

      },
      // Errors will call this callback instead:
      err => {
        let namespace = "login";

        // i18nService read language files and translate message by code
        // in case message not exists under the namespace file + language
        // uses the default message
        this.i18nService.doTranslateList(namespace, err.error).then(res => {
          this.errorMessages = res; // errorMessages is a list of error strings
        });
      }
    );
  }

  private solveRoute(userType: number, tfa: boolean) {
    if (tfa) return '/2fa/validation';
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
