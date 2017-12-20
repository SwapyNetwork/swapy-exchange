import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace/marketplace.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { ToastrService } from '../../common/services/toastr.service';


@Component({
  selector: 'app-confirm-purchase',
  templateUrl: './confirm-purchase.component.html',
  styleUrls: ['./confirm-purchase.component.css']
})
export class ConfirmPurchaseComponent implements OnInit {

  private asset;
  constructor(
    private marketplaceService: MarketplaceService,
    private swapyProtocol: SwapyProtocol,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.asset = this.marketplaceService.getCachedAsset();
  }

  public async confirmPurchase() {
    try {
      await this.swapyProtocol.buyAsset(this.asset.address);
      this.toastrService.getInstance().success('Purchase requested');
    } catch (error) {
      this.toastrService.getInstance().error(error.message);
    }

  }

}
