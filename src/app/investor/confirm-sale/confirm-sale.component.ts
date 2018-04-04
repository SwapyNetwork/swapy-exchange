import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SellAssetService } from '../sell-asset/sell-asset.service';
import { ToastrService } from '../../common/services/toastr.service';
import { StorageService } from '../../common/services/storage.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';
import { SuccessfulInvestmentService } from './../successful-investment/successful-investment.service';

@Component({
  selector: 'app-confirm-sale',
  templateUrl: './confirm-sale.component.html',
  styleUrls: ['./confirm-sale.component.css']
})
export class ConfirmSaleComponent implements OnInit {

  public asset;

  constructor(
    private toastrService: ToastrService,
    private storageService: StorageService,
    private swapyProtocol: SwapyProtocol,
    private sellAssetService: SellAssetService,
    private successfulInvestmentService: SuccessfulInvestmentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.asset = this.sellAssetService.getCachedAsset();
  }

  public async sellAsset() {
    this.router.navigate(['investor/invest/success']);
    const status = this.asset.status;
    this.storageService.setItem(this.asset.contractAddress, status);
    this.asset.status = PENDING_ETHEREUM_CONFIRMATION;
    try {
      const value = this.asset.sellValue * 100;
      // await this.swapyProtocol.sellAsset(this.asset.contractAddress, value);
      this.toastrService.getInstance().success('Asset inserted into the Marketplace');
      this.successfulInvestmentService.setMessage('Your investment was mined by the Ethereum blockchain.');
      this.storageService.getItem(this.asset.contractAddress);
    } catch (error) {
      this.storageService.remove(this.asset.contractAddress);
      this.asset.status = status;
      this.successfulInvestmentService.setErrorMessage(error.message);
      this.toastrService.error(error.message);
    }
  }

}
