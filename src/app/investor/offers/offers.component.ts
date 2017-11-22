import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Offer } from '../../common/interfaces/offer.interface';
import { OfferService } from './offer.service';
import { Web3Service } from '../../common/services/web3.service';
import { LoadingService } from '../../common/services/loading.service';
import { InvestmentAssetProtocolService as AssetService } from '../../common/services/protocol/investment-asset.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';

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
    private assetService: AssetService,
    private loadingService: LoadingService,
    private exchangeService: ExchangeService) { }

  ngOnInit() {
    this.web3 = this.web3Service.getInstance();
    this.getOffersFromBlockchain();
  }

  getOffersFromBlockchain() {

    this.exchangeService.getOffers((err, offerEvents) => {
      for (const offerEvent of offerEvents) {
        this.loadingService.show();
        const contractVariables = offerEvent.returnValues;
        const assetContract = this.assetService.getContract(contractVariables._assets[0]);
        // Get offer info from contract
        const constants = ['fixedValue', 'paybackDays', 'grossReturn'];
        this.assetService.getConstants(contractVariables._assets[0], constants).then((asset) => {
          const displayWalletAddress = contractVariables._from.substring(0, 8) +
            '...' +
            contractVariables._from
              .substring(contractVariables._from.length - 8);
          const offer = {
            raisingAmount: asset.fixedValue * 5 / 100, // Temp way of doing it. Getting all assets would take too long.
            roi: asset.grossReturn / 10000,
            paybackMonths: asset.paybackDays / 30,
            walletAddress: contractVariables._from,
            displayWalletAddress: displayWalletAddress,
            assetsAddress: contractVariables._assets
          } as any;
          this.offers.push(offer);
          this.offerService.cacheOffers(this.offers);
          this.loadingService.hide();
        });
      }
    });
  }


}
