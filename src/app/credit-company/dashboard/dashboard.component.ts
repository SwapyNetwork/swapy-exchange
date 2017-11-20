import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { OfferService } from './offer/offer.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../common/services/protocol/investment-asset.service';
import { WalletService } from '../../common/services/wallet.service';
import { Web3Service } from '../../common/services/web3.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AGREE_INVESTMENT, TRANSFER_FUNDS, CREATE_OFFER } from '../../common/interfaces/events.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public offers;

  constructor(
    private offerService: OfferService,
    private exchangeService: ExchangeService,
    private walletService: WalletService,
    private web3Service: Web3Service,
    private toastr: ToastsManager, vcr: ViewContainerRef,
    private investmentAssetService: InvestmentAssetService,
    private errorLogService: ErrorLogService) {
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.updateOffers();
  }

  private factoryOffers(offer) {
    return new Promise(resolve => {
      this.web3Service.getInstance().eth.getBlock(offer.blockHash).then(block => {
        const newOffer = {
          active: true,
          assets: [],
          companyName: offer.returnValues._from,
          createdOn: (new Date(block.timestamp * 1000)).toISOString(),
          paybackMonths: 0,
          raisingAmount: 0,
          roi: 0,
          uuid: offer.returnValues._id,
          walletAddress: offer.returnValues._from
        };
        offer.returnValues._assets.forEach(asset => {
          this.investmentAssetService.getConstants(asset, ['fixedValue', 'paybackDays', 'grossReturn', 'investor', 'status'])
          .then(assetObj => {
            const newAsset = {
              contractAddress: asset,
              investorWallet: (assetObj as any).investor,
              status: (assetObj as any).status,
              value: (assetObj as any).fixedValue / 100
            };
            newOffer.assets.push(newAsset);
            if (!newOffer.raisingAmount) {
              newOffer.paybackMonths = (assetObj as any).paybackDays;
              newOffer.raisingAmount = (assetObj as any).fixedValue * 5 / 100;
              newOffer.roi = (assetObj as any).grossReturn / 10000;
            } else if (newOffer.assets.length === 5) {
              resolve(newOffer);
            }
          });
        })
      });
    });
  }

  updateOffers() {
    this.exchangeService.getMyOffers(this.walletService.getWallet().address, (err, offers) => {
      const promises = [];
      offers.forEach(offer => {
        promises.push(this.factoryOffers(offer));
      });

      Promise.all(promises).then(resolvedOffers => {
        this.offers = resolvedOffers;
      });
    });
  }
}
