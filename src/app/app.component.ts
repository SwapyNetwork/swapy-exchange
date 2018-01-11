import { Component, ViewContainerRef } from '@angular/core';
import { LoadingService } from './common/services/loading.service';
import { WalletService } from './common/services/wallet.service';
import * as Web3 from 'web3';

import * as env from '../../env.json';
const EventEmitter2 = require('eventemitter2').EventEmitter2;

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

      const server = new EventEmitter2({
        wildcard: true,
        maxListeners: 20,
        verboseMemoryLeak: false
      });

      server.on('newUnapprovedTx', function(value1, value2) {
        console.log(value1, value2);
      })
    this.loadingService.loadingShowed$.subscribe(
      showed => {this.loading = true}
    );

    this.loadingService.loadingHid$.subscribe(
      hid => {this.loading = false}
    );

    if (typeof (window as any).web3 !== 'undefined') {
      (window as any).web3 = new Web3((window as any).web3.currentProvider);
    } else {
      (window as any).web3 = new Web3(new Web3.providers.HttpProvider((env as any).HTTP_PROVIDER));
    }

    if ((window as any).chrome) {
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
