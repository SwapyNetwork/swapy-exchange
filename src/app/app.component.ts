import { Component, ViewContainerRef } from '@angular/core';
import { LoadingService } from './common/services/loading.service';
import { WalletService } from './common/services/wallet.service';
import * as Web3 from 'web3';

const env = require('../../env.json');
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  loading = false;

  constructor(public loadingService: LoadingService,
    public walletService: WalletService, public viewContainerRef: ViewContainerRef) {

    this.loadingService.loadingShowed$.subscribe(
      showed => {this.loading = true}
    );

    this.loadingService.loadingHid$.subscribe(
      hid => {this.loading = false}
    );

    this.loadingService.show();

    if (typeof (window as any).web3 !== 'undefined') {
      (window as any).web3 = new Web3((window as any).web3.currentProvider);
    } else {
      (window as any).web3 = new Web3(new Web3.providers.HttpProvider((env as any).HTTP_PROVIDER));
    }

    if ((window as any).chrome.ipcRenderer) {
      (window as any).isElectron = true;
    }

    this.walletService.listenForAccountChanges();
  }

  showLoading() {
    this.loading = true;
  }

  hideLoading() {
    this.loading = false;
  }

}
