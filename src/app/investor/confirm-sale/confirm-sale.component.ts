import { Component, OnInit } from '@angular/core';
import { SellAssetService } from '../sell-asset/sell-asset.service';
import { ToastrService } from '../../common/services/toastr.service';
import { StorageService } from '../../common/services/storage.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offerAssetStatus.interface';

@Component({
  selector: 'app-confirm-sale',
  templateUrl: './confirm-sale.component.html',
  styleUrls: ['./confirm-sale.component.css']
})
export class ConfirmSaleComponent implements OnInit {

  private asset;

  constructor(
    private toastrService: ToastrService,
    private storageService: StorageService,
    private swapyProtocol: SwapyProtocol,
    private sellAssetService: SellAssetService
  ) { }

  ngOnInit() {
    this.asset = this.sellAssetService.getCachedAsset();
  }

  public async sellAsset() {
    const status = this.asset.status;
    this.storageService.setItem(this.asset.contractAddress, status);
    this.asset.status = PENDING_ETHEREUM_CONFIRMATION;
    try {
      const value = this.asset.sellValue * 100;
      await this.swapyProtocol.sellAsset(this.asset.contractAddress, value);
      this.toastrService.getInstance().success('Asset inserted into the Marketplace');
      this.storageService.getItem(this.asset.contractAddress);
    } catch (error) {
      this.storageService.remove(this.asset.contractAddress);
      this.asset.status = status;
      this.toastrService.getInstance().error(error.message);
    }
  }

}
