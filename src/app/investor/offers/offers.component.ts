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

  async getOffersFromBlockchain() {
    this.loadingService.show();
    try {
      const offers = await this.swapyProtocol.get('Offers');

      offers.forEach(async offerEvent => {
        const contractVariables = offerEvent.returnValues;
        let constants = ['paybackDays', 'grossReturn'];
        const offerAsset = await this.swapyProtocol.getAssetConstants(contractVariables._assets[0], constants);
        constants = ['value', 'status', 'tokenFuel'];
        const assets = [];
        for (const asset of contractVariables._assets) {
          let assetValues = await this.swapyProtocol.getAssetConstants(asset, constants);
          assets.push(assetValues);          
        }
        const totalTokens = assets.map(asset => asset.tokenFuel).reduce((current, total) => Number(current) + Number(total));
        const raisingAmount = assets.map(asset => asset.value).reduce((current, total) => Number(current) + Number(total));
        const offer = {
          raisingAmount: raisingAmount / 100,
          grossReturn: offerAsset.grossReturn / 10000,
          paybackMonths: offerAsset.paybackDays / 30,
          status: assets.map(asset => asset.status),
          averageCollateral: totalTokens / assets.length / Math.pow(10, 18),
          walletAddress: contractVariables._from,
          assetsAddress: contractVariables._assets
        } as any;
        this.offers.push(offer);
      });
      this.offerService.cacheOffers(this.offers);
      this.loadingService.hide();
    } catch (err) {
      this.loadingService.hide();
      console.log(err);
    }
  }
}
