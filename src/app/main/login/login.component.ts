import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { LoginResponseModel } from './login-response.model';
import { UserResponseInterface, INVESTOR, CREDIT_COMPANY } from '../../common/interfaces/user-response.interface';

import { I18nService } from '../../common/services/i18n.service';
import { Web3Service } from '../../common/services/web3.service';
import { WalletService } from '../../common/services/wallet.service';
import { StorageService } from '../../common/services/storage.service';
import { LogoutService } from '../../common/services/logout.service';
import { LoadingService } from '../../common/services/loading.service';
import { UportService } from '../../common/services/uport.service';
import { Wallet } from '../../common/interfaces/wallet.interface';

const env = require('../../../../env.json');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public requireMetaMask;
  public requireNetwork;
  public account: Wallet;
  public errorMessages: string[] = [];
  private web3;
  public env = env;

  public INVESTOR = INVESTOR;
  public CREDIT_COMPANY = CREDIT_COMPANY;

  constructor(private loginService: LoginService,
    private i18nService: I18nService,
    private router: Router,
    private web3Service: Web3Service,
    private wallet: WalletService,
    private walletService: WalletService,
    private storageService: StorageService,
    public logoutService: LogoutService,
    public uportService: UportService,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.checkAccount();
    this.walletService.listenForAccountChanges();
  }

  public getNetworkName(networkId) {
    switch (Number(networkId)) {
      case 1:
        return 'mainnet';
      case 3:
        return 'ropsten';
      case 4:
        return 'rinkeby';
      default:
        return networkId > 5000 ? 'ganache' : 'unknown';
    }
  }

  private async checkAccount() {
    const self = this;
    (this.account as any) = await this.walletService.getCurrentAccount();
    setTimeout(async () => {
      if (!this.account || this.account.address === undefined) {
        self.requireMetaMask = true;
      } else if (Number(this.account.network) !== Number(env.NETWORK_ID) && env.ENV !== 'dev') {
        self.requireNetwork = true;
      } else {
        self.requireNetwork = false;
        self.requireMetaMask = false;
      }
      self.checkAccount();
    }, 1000);
  }

  login(userType, user) {
    this.storageService.setItem('user', { wallet: this.account, type: userType, name: 'Anonymous', avatar: 'assets/img/unknown-user.png'});
    this.router.navigate([this.solveRoute(userType)]);
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
