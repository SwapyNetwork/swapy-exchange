import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';
import { InvestorComponent } from '../investor.component';
import { StorageService } from '../../common/services/storage.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { ToastrService } from '../../common/services/toastr.service';
import { WalletService } from '../../common/services/wallet.service';

import * as sha1 from 'sha1';

@Component({
  selector: 'app-cancel-asset',
  templateUrl: './cancel-asset.component.html',
  styleUrls: ['./cancel-asset.component.css']
})
export class CancelAssetComponent implements OnInit {

  public assets;
  public walletAddress;

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public FOR_SALE = FOR_SALE;
  public PENDING_INVESTOR_AGREEMENT = PENDING_INVESTOR_AGREEMENT;
  public PENDING_ETHEREUM_CONFIRMATION = PENDING_ETHEREUM_CONFIRMATION;

  constructor(
    private dashboardService: DashboardService,
    private swapyProtocol: SwapyProtocol,
    private walletService: WalletService,
    private toastrService: ToastrService,
    private storageService: StorageService,
    public investorComponent: InvestorComponent,
    private router: Router

  ) { }

  ngOnInit() {
    this.assets = this.dashboardService.getSelectedAssets();
    this.walletAddress = this.walletService.getWallet().address.toLowerCase();
  }

  public calculateReturnAmount(asset) {
    return asset.value * (1 + asset.grossReturn);
  }

  public calculatePaybackDate(asset) {
    const paybackDate = new Date(asset.investedAt);
    paybackDate.setMonth(paybackDate.getMonth() + asset.paybackMonths);
    return paybackDate;
  }

  public calculateAssetProgression(asset) {
    const paybackDate = new Date(asset.investedAt);
    const now = new Date();
    const monthsDiff = (now.getFullYear() * 12 + now.getMonth()) - (paybackDate.getFullYear() * 12 + paybackDate.getMonth());
    return monthsDiff;
  }

  public statusToString(status) {
    let statusString;
    switch (status) {
      case this.AVAILABLE:
        statusString = '';
        break;
      case this.PENDING_OWNER_AGREEMENT:
        statusString = 'Waiting';
        break;
      case this.INVESTED:
        statusString = 'Invested';
        break;
      case this.RETURNED:
        statusString = 'Returned';
        break;
      case this.FOR_SALE:
        statusString = 'On sale';
        break;
      case this.PENDING_INVESTOR_AGREEMENT:
        statusString = 'Waiting';
        break;
      case this.DELAYED_RETURN:
        statusString = 'Delayed return';
        break;
      case this.PENDING_ETHEREUM_CONFIRMATION:
        statusString = 'Pending transaction confirmation';
        break;
    }

    return statusString;

  }

  private onError(error, assets, status) {
    assets.forEach(asset => {
      this.storageService.remove(asset.contractAddress);
    });
    if (sha1(error.message) === '699e7c6d81ba58075ee84cf2a640c18a409efcba') { // 50 blocks later and transaction has not being mined yet.
      this.toastrService.error('Transaction is still being mined. Check it out later to see if the transaction was mined');
    } else {
      assets.forEach(asset => {
        asset.status = status;
      });
      this.toastrService.error(error.message);
    }
  }

  public async cancel() {
    if (this.assets[0].status === PENDING_OWNER_AGREEMENT && this.assets[0].investor === this.walletAddress) {
      this.cancelInvestment();
    }
    if (this.assets[0].status === FOR_SALE && this.assets[0].investor === this.walletAddress) {
      this.cancelSellOrder();
    }
    if (this.assets[0].status === PENDING_INVESTOR_AGREEMENT && this.assets[0].investor === this.walletAddress) {
      this.refuseSale();
    }
    if (this.assets[0].status === PENDING_INVESTOR_AGREEMENT && this.assets[0].investor !== this.walletAddress) {
      this.cancelSale();
    }

  }

  public async cancelInvestment() {
    const status = []
    this.assets.forEach(asset => {
      status.push(asset.status);
      this.storageService.setItem(asset.contractAddress, asset.status);
      asset.status = PENDING_ETHEREUM_CONFIRMATION;
    });
    const contractAddresses = this.assets.map(asset => asset.contractAddress);
    try {
      await this.swapyProtocol.cancelInvestment(contractAddresses);
      this.toastrService.getInstance().success('Investment(s) cancelled');
      this.router.navigate(['/investor']);
    } catch (error) {
      this.assets.forEach((asset, index) => {
        asset.status = status[index];
        this.storageService.remove(asset.contractAddress);
      });
      this.onError(error, this.assets, status);
    }
  }

  public async cancelSellOrder() {
    const status = []
    this.assets.forEach(asset => {
      status.push(asset.status);
      this.storageService.setItem(asset.contractAddress, asset.status);
      asset.status = PENDING_ETHEREUM_CONFIRMATION;
    });
    const contractAddresses = this.assets.map(asset => asset.contractAddress);
    try {
      await this.swapyProtocol.cancelSellOrder(contractAddresses);
      this.toastrService.getInstance().success('Sell order(s) cancelled');
      this.router.navigate(['/investor']);
    } catch (error) {
      this.assets.forEach((asset, index) => {
        asset.status = status[index];
        this.storageService.remove(asset.contractAddress);
      });
      this.onError(error, this.assets, status);
    }
  }

  public async refuseSale() {
    const status = []
    this.assets.forEach(asset => {
      status.push(asset.status);
      this.storageService.setItem(asset.contractAddress, asset.status);
      asset.status = PENDING_ETHEREUM_CONFIRMATION;
    });
    const contractAddresses = this.assets.map(asset => asset.contractAddress);
    try {
      await this.swapyProtocol.refuseSale(contractAddresses);
      this.toastrService.getInstance().success('Asset(s) sale refused');
      this.router.navigate(['/investor']);
    } catch (error) {
      this.assets.forEach((asset, index) => {
        asset.status = status[index];
        this.storageService.remove(asset.contractAddress);
      });
      this.onError(error, this.assets, status);
    }
  }

  public async cancelSale() {
    const status = []
    this.assets.forEach(asset => {
      status.push(asset.status);
      this.storageService.setItem(asset.contractAddress, asset.status);
      asset.status = PENDING_ETHEREUM_CONFIRMATION;
    });
    const contractAddresses = this.assets.map(asset => asset.contractAddress);
    try {
      await this.swapyProtocol.cancelSale(contractAddresses);
      this.toastrService.getInstance().success('Asset(s) sale refused');
      this.router.navigate(['/investor']);
    } catch (error) {
      this.assets.forEach((asset, index) => {
        asset.status = status[index];
        this.storageService.remove(asset.contractAddress);
      });
      this.onError(error, this.assets, status);
    }
  }

}
