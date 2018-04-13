import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';
import { SellAssetService } from './sell-asset.service';
import { StorageService } from '../../common/services/storage.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { ToastrService } from '../../common/services/toastr.service';
import { InvestorComponent } from '../investor.component';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';
import { MessageService } from '../message/message.service';

import * as sha1 from 'sha1';

@Component({
  selector: 'app-sell-asset',
  templateUrl: './sell-asset.component.html',
  styleUrls: ['./sell-asset.component.css']
})
export class SellAssetComponent implements OnInit {

  public assets;
  public sellPrice = [];

  public amountMask = createNumberMask({
    prefix: 'US$ ',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
  });

  constructor(
    private router: Router,
    public investorComponent: InvestorComponent,
    private toastrService: ToastrService,
    private swapyProtocol: SwapyProtocol,
    private messageService: MessageService,
    private storageService: StorageService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.assets = this.dashboardService.getSelectedAssets();
    this.setSellPrice();
  }

  public setSellPrice() {
    this.assets.forEach((asset, index) => {
      const progression = this.calculateAssetProgression(asset) * 100 / asset.paybackMonths;
      this.sellPrice[index] = asset.value * (1 + asset.grossReturn * progression / 100);
    });
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

  public porcentageProgression(asset) {
    const porcentage = this.calculateAssetProgression(asset) * 100 / asset.paybackMonths;
    return Math.floor(porcentage / 5) * 5;
  }

  private onError(error) {
    this.toastrService.error(error.message);
    this.messageService.setErrorMessage(error.message);
  }

  public async sellAsset() {
    this.router.navigate(['investor/message']);
    const prices = this.sellPrice.map(price => parseFloat(String(price).replace(/[^0-9.]/g, '')) * 100);
    const contractAddresses = this.assets.map(asset => asset.contractAddress);
    try {
      await this.swapyProtocol.sellAssets(contractAddresses, prices);
      this.toastrService.getInstance().success('Asset inserted into the Marketplace');
      this.messageService.setMessage('Asset inserted into the Marketplace');
      this.messageService.setHeaderMessage('Transaction confirmed');
    } catch (error) {
      this.onError(error);
    }
  }

}
