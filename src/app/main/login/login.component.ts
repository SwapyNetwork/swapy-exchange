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

  public requireMetaMask;
  public account = '';
  public password = '';
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
    this.checkAccount();
  }

  private async checkAccount() {
    const self = this;
    const accounts = await self.web3Service.getInstance().eth.getAccounts();
    this.account = accounts[0];
    setTimeout(() => {
      if (!this.account) {
        self.requireMetaMask = true;
        self.checkAccount();
      } else {
        self.requireMetaMask = false;
      }
    }, 1000);
  }

  login(userType) {
    this.router.navigate([this.solveRoute(userType)]);
    const wallet: Wallet = this.walletService.getWallet();
    if (wallet) {
      this.walletService.addWalletToWeb3(wallet);
    } else {
      this.errorMessages.push('Local wallet not found. Please log in from the device you signed up.' +
        'Decentralized backup to be done in a later version.'); // @todo Improve error message.
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
