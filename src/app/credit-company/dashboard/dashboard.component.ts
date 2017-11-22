import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../common/services/protocol/investment-asset.service';
import { WalletService } from '../../common/services/wallet.service';
import { Web3Service } from '../../common/services/web3.service';
import { LoadingService } from '../../common/services/loading.service';
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
    private exchangeService: ExchangeService,
    private walletService: WalletService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
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
          assets: [],
          companyAddress: offer.returnValues._from,
          createdOn: (new Date(block.timestamp * 1000)).toISOString(),
          paybackMonths: 0,
          raisingAmount: 0,
          grossReturn: 0,
          walletAddress: offer.returnValues._from
        };
        offer.returnValues._assets.forEach(asset => {
          const assetABI = this.investmentAssetService.getContract(asset);
          assetABI.methods.getAsset().call().then(assetValues => {
            const newAsset = {
              contractAddress: asset,
              investorWallet: assetValues[6],
              status: assetValues[5],
              value: assetValues[2] / 100
            };
            newOffer.assets.push(newAsset);
            if (!newOffer.raisingAmount) {
              newOffer.paybackMonths = assetValues[3] / 30;
              newOffer.raisingAmount = assetValues[2] * 5 / 100;
              newOffer.grossReturn = assetValues[4] / 10000;
            } else if (newOffer.assets.length === offer.returnValues._assets.length) {
              resolve(newOffer);
            }
          });
        })
      });
    });
  }

  updateOffers() {
    this.loadingService.show();
    this.exchangeService.getMyOffers(this.walletService.getWallet().address, (err, offers) => {
      const promises = [];
      offers.forEach(offer => {
        promises.push(this.factoryOffers(offer));
      });

      Promise.all(promises).then(resolvedOffers => {
        this.offers = resolvedOffers;
        this.loadingService.hide();
      });
    });
  }
}
