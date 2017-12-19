import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../common/services/loading.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  public assets = [];

  constructor(
    private loadingService: LoadingService,
    private swapyProtocol: SwapyProtocol
  ) { }

  ngOnInit() {
    this.getAssetsForSale();
  }

  private getDisplayWalletAddress(address: string) {
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`
  }

  public async getAssetsForSale() {
    this.loadingService.show();
    try {
      const forSaleEvents = await this.swapyProtocol.get('ForSale');

      forSaleEvents.forEach(async forSaleEvent => {
        const assetAddress = forSaleEvent.returnValues._asset;
        const assetValue = forSaleEvent.returnValues._value;
        const investor = forSaleEvent.returnValues._investor;
        const assetConstants = await this.swapyProtocol.getAssetConstants(assetAddress, ['grossReturn', 'paybackDays']);
        const asset = {
          address: assetAddress,
          displayAddress: this.getDisplayWalletAddress(assetAddress),
          investor: investor,
          grossReturn: assetConstants.grossReturn / 10000,
          paybackMonths: assetConstants.paybackDays / 30,
          value: assetValue / 100
        };
        this.assets.push(asset);
      });

      this.loadingService.hide();

    } catch (error) {
      this.loadingService.hide();
      console.error(error);

    }
  }

}
