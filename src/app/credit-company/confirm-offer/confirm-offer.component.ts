import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../../common/services/i18n.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';

import { AddOfferService } from '../add-offer/add-offer.service';
import { CreditCompanyComponent } from '../credit-company.component';
import { ToastrService } from '../../common/services/toastr.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { MessageService } from '../../common/message/message.service';
import { WalletService } from '../../common/services/wallet.service';


@Component({
  selector: 'app-confirm-offer',
  templateUrl: './confirm-offer.component.html',
  styleUrls: ['./confirm-offer.component.css']
})
export class ConfirmOfferComponent implements OnInit {

  public walletAddress: string;
  public offer: any;
  public errorMessages: string[] = [];
  private toastr;
  private defaultAssets = [0, 0, 0, 0, 0];

  constructor(private addOfferService: AddOfferService,
    private router: Router,
    private i18nService: I18nService,
    private creditCompanyComponent: CreditCompanyComponent,
    private swapyProtocol: SwapyProtocol,
    private messageService: MessageService,
    private toastrService: ToastrService,
    private errorLogService: ErrorLogService,
    private walletService: WalletService,
  ) {
    this.walletAddress = this.walletService.getWallet().address;
  }

  ngOnInit() {
    this.toastr = this.toastrService.getInstance();
    this.offer = this.addOfferService.getCachedOffer();
    if (!this.offer) {
      this.router.navigate(['/credit-company/raise']);
    }
  }

  private onError(error) {
    this.toastrService.error(error.message);
    this.messageService.setErrorMessage(error.message);
  }

  async confirmOffer() {
    const assetValues = this.offer.assets.map(asset => asset.value * 100);
    this.router.navigate(['/credit-company/message']);
    try {
      await this.swapyProtocol.createOffer(
        this.offer.paybackMonths * 30,
        this.offer.grossReturn,
        'USD',
        this.offer.raisingAmount,
        assetValues
      );
      this.toastrService.getInstance().success('Offer created!');
      this.messageService.setLastMessage('Offer created!');
      this.messageService.setHeaderMessage('Transaction confirmed');
    } catch (error) {
      this.onError(error);
    }
    this.creditCompanyComponent.refreshBalance();

  }

}
