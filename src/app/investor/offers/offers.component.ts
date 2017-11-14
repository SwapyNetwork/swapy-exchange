import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Offer } from '../../common/interfaces/offer.interface';
import { OfferService } from './offer.service';
import { Web3Service } from '../../common/services/web3.service';
import { SwapyExchangeInterface as SwapyExchange } from '../../../../contracts/SwapyExchange';
import { InvestmentAssetInterface as InvestmentAsset } from '../../../../contracts/InvestmentAsset';
import { addresses } from '../../../../contracts/address';

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

  constructor(private offerService: OfferService, private web3Service: Web3Service) { }

  ngOnInit() {
    this.web3 = this.web3Service.getInstance();
    this.getOffersFromBlockchain();

    this.offerService.getOffers().then(
      (data: any) => {

        for (const o of data.offers) {
          this.offers.push({
            roi: o.offerRoi,
            paybackMonths: o.offerPaybackMonths,
            raisingAmount: o.offerRaisingAmount,
            walletAddress: o.offerWalletAddress,
            contractAddress: o.offerContractAddress,
            uuid: o.offerUuid,
            companyName: o.firstName + ' ' + o.lastName,
            companyLogo: o.picture,
            companyUuid: o.uuid,
            assets: o.assets,
            createdOn: o.createdOn,
          });
        }

        this.offerService.cacheOffers(this.offers);

      },
      error =>  this.errorMessage = <any>error
    );
  }

  getOffersFromBlockchain() {
    const contract = new this.web3.eth.Contract(SwapyExchange.abi, addresses.swapyExchange);

    contract.getPastEvents('Offers', {
      fromBlock: 0,
      toBlock: 'latest'
    }, (error, offersEvents) => {
      for (const offersEvent of offersEvents) {
        const contractVariables = offersEvent.returnValues;
        // console.log(offersEvents);
        const asset = [];
        let promises = [];
        for (const assetAddress of contractVariables._assets) {
          const contractAsset = new this.web3.eth.Contract(InvestmentAsset.abi, assetAddress);
          // promises.push(new Promise((resolve) => {
          // }));
          promises.push(new Promise((resolve) => {
            contractAsset.methods.value().call().then(value => {
                contractAsset.methods.status().call().then(status => {
                  resolve([value, status]);
                  // resolve(status);
                });
            });
          }));
          //   contractAsset.methods.value().call().then(value => {
          //     asset.push({status, value});
          //
          //     /*
          //     {
          //       roi: contractVariables._grossReturn,
          //       paybackMonths: contractVariables._paybackMonths,
          //       walletAddress: contractVariables._from,
          //       contractAddress: contractAddress._offerAddress,
          //       --
          //       assets: o.assets,
          //       raisingAmount: o.offerRaisingAmount,
          //       uuid: o.offerUuid,
          //       companyName: o.firstName + ' ' + o.lastName,
          //       companyLogo: o.picture,
          //       companyUuid: o.uuid,
          //       createdOn: o.createdOn,
          //     }
          //     */
          //     const offer = {
          //       roi: contractVariables._grossReturn,
          //       paybackMonths: contractVariables._paybackMonths,
          //       walletAddress: contractVariables._from,
          //       contractAddress: contractVariables._offerAddress,
          //       assets: asset
          //     }
          // });
        }

        Promise.all(promises).then((result) => {
          console.log(result);
        })
      }
    });
  }


}
