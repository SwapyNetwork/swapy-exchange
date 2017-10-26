import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../../common/services/i18n.service';
import { ExchangeProtocolService as ExchangeProtocol } from '../../common/services/protocol/exchange.service';

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

  confirmOffer() {
    this.addOfferService.addOffer(this.offer).then(
      data => {
        this.errorLogService.setClassName('ConfirmOfferComponent');
        this.errorLogService.setFunctionName('confirmOffer');
        // Improve this call
        this.walletService.getEthBalance().then((balance) => {
          this.errorLogService.setBeforeETHbalance(balance);
        });
        this.exchangeProtocol
          .createOffer(data.event.uuid, this.offer.paybackMonths, this.offer.roi, [111, 222, 333, 444, 555], (success) => {
            console.log(success);
            this.toastrService.getInstance().success('Your offer was mined by the Ethereum blockchain.');
            this.pendingOfferService.setMessage('Your offer was mined by the Ethereum blockchain.');
          }, (error) => {
            this.errorLogService.setError(error);
            // Improve this call
            this.walletService.getEthBalance().then((balance) => {
              this.errorLogService.setAfterETHbalance(balance);
            });
            console.log(error);
            this.pendingOfferService.setErrorMessage(error.message);
            this.toastrService.getInstance().error(this.pendingOfferService.getMessage());
          });
        this.offer.uuid = data.offer.uuid;
        this.offer.address = data.offer.address;
        this.addOfferService.cacheOffer(this.offer);
        this.creditCompanyComponent.refreshStatusBar();

        this.router.navigate(['/credit-company/raise/pending']);
      },
      error => {
        const namespace = 'confirm-offer';

        this.i18nService.doTranslateList(namespace, error).then( res => {
          this.errorMessages = res; // errorMessages is a list of error strings
        });
      }
    );
  }

}
