import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../../common/services/i18n.service';
import { ExchangeProtocolService as ExchangeProtocol } from '../../common/services/protocol/exchange.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/protocol/swapy-protocol.service';

import { AddOfferService } from '../add-offer/add-offer.service';
import { CreditCompanyComponent } from '../credit-company.component';
import { ToastrService } from '../../common/services/toastr.service';
import { PendingOfferService } from './../pending-offer/pending-offer.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { WalletService } from '../../common/services/wallet.service';


@Component({
  selector: 'app-confirm-offer',
  templateUrl: './confirm-offer.component.html',
  styleUrls: ['./confirm-offer.component.css']
})
export class ConfirmOfferComponent implements OnInit {

  public offer: any;
  public errorMessages: string[] = [];
  private toastr;

  constructor(private addOfferService: AddOfferService,
    private router: Router,
    private i18nService: I18nService,
    private creditCompanyComponent: CreditCompanyComponent,
    private exchangeProtocol: ExchangeProtocol,
    private swapyProtocol: SwapyProtocol,
    private toastrService: ToastrService,
    private pendingOfferService: PendingOfferService,
    private errorLogService: ErrorLogService,
    private walletService: WalletService,
  ) {
  }

  ngOnInit() {
    this.toastr = this.toastrService.getInstance();
    this.offer = this.addOfferService.getCachedOffer();
    if (!this.offer) {
      this.router.navigate(['/credit-company/raise']);
    }
  }

  async confirmOffer() {
    const offerTermsHash = '67e49469e62a9805e43744ec4437a6dcf6c6bc36d6a33be837e95b8d325816ed';

    const a = Math.ceil(this.offer.raisingAmount / 5 * 100);
    const assetValues = [a, a, a, a, a];

    this.errorLogService.setClassName('ConfirmOfferComponent');
    this.errorLogService.setFunctionName('confirmOffer');
    // Improve this call
    try {
      const offerTx = await this.swapyProtocol
        .createOffer(this.offer.paybackMonths * 30, this.offer.grossReturn, 'USD', this.offer.raisingAmount, offerTermsHash, assetValues);
      this.toastrService.getInstance().success('Your offer was mined by the Ethereum blockchain.');
      this.pendingOfferService.setMessage('Your offer was mined by the Ethereum blockchain.');
    } catch (error) {
      this.walletService.getEthBalance().then((currentBalance) => {
        this.errorLogService.setAfterETHbalance(currentBalance);
        this.errorLogService.setError(error);
      });
      console.log(error);
      this.pendingOfferService.setErrorMessage(error.message);
      this.toastrService.getInstance().error(this.pendingOfferService.getMessage());
    }
    this.creditCompanyComponent.refreshStatusBar();

    this.router.navigate(['/credit-company/raise/pending']);
  }

}
