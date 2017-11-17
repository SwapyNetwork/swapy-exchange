import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { OfferService } from './offer/offer.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../common/services/protocol/investment-asset.service';
import { WalletService } from '../../common/services/wallet.service';
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
    private toastr: ToastsManager, vcr: ViewContainerRef,
    private investmentAssetService: InvestmentAssetService,
    private errorLogService: ErrorLogService) {
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.updateOffers();
  }

  updateOffers() {
    this.offerService.getMyOffers().then(
      (data: any) => {
        this.offers = data.offers;
      },
      (error: any) => {
        console.log(error)
      }
    );
    let contract;
    this.exchangeService.getMyOffers(this.walletService.getWallet().address, (err, offers) => {
      offers.forEach(offer => {
        offer.returnValues._assets.forEach(asset => {
          this.investmentAssetService.getConstants(asset, ['fixedValue', 'paybackDays']).then(obj => console.log(obj));
        })
      });
      console.log(offers);
    });
  }

  getUpdatesFromBlockchain() {}
}
