import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { LoginResponseModel } from './login-response.model';
import { UserResponseInterface, INVESTOR, CREDIT_COMPANY } from '../../common/interfaces/user-response.interface';

import { I18nService } from '../../common/services/i18n.service';
import { Web3Service } from '../../common/services/web3.service';
import { ExchangeProtocolService } from '../../common/services/protocol/exchange.service';
import { FinIdProtocolService } from '../../common/services/protocol/fin-id.service';
import { WalletService } from '../../common/services/wallet.service';
import { StorageService } from '../../common/services/storage.service';
import { LogoutService } from '../../common/services/logout.service';
import { Wallet } from '../../common/interfaces/wallet.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public requireMetaMask;
  public agreedToTerms;
  public account: Wallet;
  public errorMessages: string[] = [];
  private web3;

  public INVESTOR = INVESTOR;
  public CREDIT_COMPANY = CREDIT_COMPANY;

  constructor(private loginService: LoginService,
    private i18nService: I18nService,
    private router: Router,
    private web3Service: Web3Service,
    private wallet: WalletService,
    private protocolService: ExchangeProtocolService,
    private finIdService: FinIdProtocolService,
    private walletService: WalletService,
    private storageService: StorageService,
    public logoutService: LogoutService
  ) {}

  ngOnInit() {
    this.checkAccount();
  }

  private async checkAccount() {
    const self = this;
    this.account = await this.walletService.getCurrentAccount();
    setTimeout(async () => {
      if (!this.account) {
        self.requireMetaMask = true;
        self.checkAccount();
      } else {
        self.requireMetaMask = false;
      }
    }, 1000);
  }

  login(userType) {
    if (this.agreedToTerms === true) {
      this.storageService.setItem('user', { wallet: this.account, type: userType });
      this.router.navigate([this.solveRoute(userType)]);
    } else {
      this.errorMessages.push('You have to agree to Swapy\'s Terms of Service and Privacy Policy to proceed.');
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
