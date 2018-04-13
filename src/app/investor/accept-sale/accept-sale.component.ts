import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { ToastrService } from '../../common/services/toastr.service';
import { StorageService } from '../../common/services/storage.service';
import { InvestorComponent } from '../investor.component';
import { MessageService } from '../message/message.service';

import * as sha1 from 'sha1';

@Component({
  selector: 'app-accept-sale',
  templateUrl: './accept-sale.component.html',
  styleUrls: ['./accept-sale.component.css']
})
export class AcceptSaleComponent implements OnInit {
  public assets;

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public FOR_SALE = FOR_SALE;
  public PENDING_INVESTOR_AGREEMENT = PENDING_INVESTOR_AGREEMENT;
  public PENDING_ETHEREUM_CONFIRMATION = PENDING_ETHEREUM_CONFIRMATION;

  constructor(
    private storageService: StorageService,
    private swapyProtocol: SwapyProtocol,
    private messageService: MessageService,
    private toastrService: ToastrService,
    public investorComponent: InvestorComponent,
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit() {
    this.assets = this.dashboardService.getSelectedAssets();
  }

  public calculateAssetProgression(asset) {
    const paybackDate = new Date(asset.investedAt);
    const now = new Date();
    const monthsDiff = (now.getFullYear() * 12 + now.getMonth()) - (paybackDate.getFullYear() * 12 + paybackDate.getMonth());
    return monthsDiff;
  }

  public porcentageProgression(asset) {
    const porcentage = this.calculateAssetProgression(asset) * 100 / asset.paybackMonths;
    return Math.floor(porcentage / 5) * 5;
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

  private onError(error) {
    this.toastrService.error(error.message);
    this.messageService.setErrorMessage(error.message);
  }

  public async acceptSale() {
    this.router.navigate(['investor/message']);
    const contractAddresses = this.assets.map(asset => asset.contractAddress);
    try {
      await this.swapyProtocol.acceptSale(contractAddresses);
      this.toastrService.getInstance().success('Asset(s) sold');
      this.messageService.setMessage('Asset(s) sold');
      this.messageService.setHeaderMessage('Transaction confirmed');
    } catch (error) {
      this.onError(error);
    }
  }

}
