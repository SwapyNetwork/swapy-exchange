import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Offer } from '../../common/interfaces/offer.interface';
import { OfferService } from './offer.service';
import { Web3Service } from '../../common/services/web3.service';
import { LoadingService } from '../../common/services/loading.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  public offers: Offer[] = [];
  public errorMessage;
  public web3;
  mode = 'Observable';

  constructor(
    private offerService: OfferService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private swapyProtocol: SwapyProtocol) { }

  ngOnInit() {
    this.web3 = this.web3Service.getInstance();
    this.getOffersFromBlockchain();
  }

  private getDisplayWalletAddress(walletAddress: string) {
    return `${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 8)}`
  }

  async getOffersFromBlockchain() {
    this.loadingService.show();
    try {
      const offers = await this.swapyProtocol.get('Offers');

      offers.forEach(async offerEvent => {
        const contractVariables = offerEvent.returnValues;
        const constants = ['value', 'paybackDays', 'grossReturn'];
        const asset = await this.swapyProtocol.getAssetConstants(contractVariables._assets[0], constants);
        const displayWalletAddress = this.getDisplayWalletAddress(contractVariables._from);
        const offer = {
          raisingAmount: asset.value * 5 / 100, // Temp way of doing it. Getting all assets would take too long.
          grossReturn: asset.grossReturn / 10000,
          paybackMonths: asset.paybackDays / 30,
          walletAddress: contractVariables._from,
          displayWalletAddress: displayWalletAddress,
          assetsAddress: contractVariables._assets
        } as any;
        this.offers.push(offer);
        this.offerService.cacheOffers(this.offers);
      });
      this.loadingService.hide();
    } catch (err) {
      this.loadingService.hide();
      console.log(err);
    }
  }
}
