import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Offer } from '../../common/interfaces/offer.interface';
import { OfferService } from './offer.service';
import { Web3Service } from '../../common/services/web3.service';
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
    private exchangeService: ExchangeService) { }

  ngOnInit() {
    this.web3 = this.web3Service.getInstance();
    this.getOffersFromBlockchain();
  }

  getOffersFromBlockchain() {

    this.exchangeService.getOffers((err, offerEvents) => {
      for (const offerEvent of offerEvents) {
        const contractVariables = offerEvent.returnValues;
        const assetContract = this.assetService.getContract(contractVariables._assets[0]);
        // Get offer info from contract
        const offer = {
          roi: contractVariables._grossReturn / 10000,
          paybackMonths: contractVariables._paybackMonths,
          walletAddress: contractVariables._from,
          assets: contractVariables._asset
        } as any;
        this.offers.push(offer);
      }
      this.offerService.cacheOffers(this.offers);
    });

  //
  //   contract.getPastEvents('Offers', {
  //     fromBlock: 0,
  //     toBlock: 'latest'
  //   }, (error, offersEvents) => {
  //     for (const offersEvent of offersEvents) {
  //       const contractVariables = offersEvent.returnValues;
  //       // console.log(offersEvents);
  //       const promises = [];
  //       for (const assetAddress of contractVariables._assets) {
  //         const contractAsset = new this.web3.eth.Contract((InvestmentAsset as any).abi, assetAddress);
  //         promises.push(new Promise((resolve) => {
  //           return contractAsset.methods.value().call().then(value => {
  //             return contractAsset.methods.status().call().then(status => {
  //               value = this.web3.utils.fromWei(value) * 340; // Temporary fixed value in Alpha
  //               const offerAssets = {
  //                   value,
  //                   status
  //               };
  //               resolve(offerAssets);
  //             });
  //           });
  //         }));
  //       }
  //
  //       Promise.all(promises).then((asset) => {
  //         /*
  //         {
  //           roi: contractVariables._grossReturn,
  //           paybackMonths: contractVariables._paybackMonths,
  //           walletAddress: contractVariables._from,
  //           contractAddress: contractAddress._offerAddress,
  //           --
  //           assets: o.assets,
  //           raisingAmount: o.offerRaisingAmount,
  //           uuid: o.offerUuid,
  //           companyName: o.firstName + ' ' + o.lastName,
  //           companyLogo: o.picture,
  //           companyUuid: o.uuid,
  //           createdOn: o.createdOn,
  //         }
  //         */
  //         const offer = {
  //           roi: contractVariables._grossReturn / 10000,
  //           paybackMonths: contractVariables._paybackMonths,
  //           walletAddress: contractVariables._from,
  //           contractAddress: contractVariables._offerAddress,
  //           assets: asset
  //         } as any;
  //         this.offers.push(offer);
  //         this.offerService.cacheOffers(this.offers);
  //
  //       });
  //     }
  //   });
  }


}
