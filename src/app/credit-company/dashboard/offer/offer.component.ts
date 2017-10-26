import { Component, OnInit, Input } from '@angular/core';
import { Offer } from '../../../common/interfaces/offer.interface';
import { I18nService } from '../../../common/services/i18n.service';
import { ToastrService } from '../../../common/services/toastr.service';
import { OfferService } from './offer.service';
import { LinkService } from '../../../common/services/link.service';
import { WalletService } from '../../../common/services/wallet.service';
import { ErrorLogService } from '../../../common/services/error-log.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../../common/services/protocol/investment-asset.service';
import {
  TX_CREATION_PENDING, TX_CREATED, LOCKED, TX_AGREEMENT_PENDING,
  TX_AGREED, TX_INVEST_PENDING, TX_INVESTED
} from '../../../common/interfaces/offerAssetStatus.interface';

import * as env from '../../../../../env.json';

@Component({
  selector: 'app-dashboard-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  public TX_CREATION_PENDING = TX_CREATION_PENDING;
  public TX_CREATED = TX_CREATED;
  public LOCKED = LOCKED;
  public TX_AGREEMENT_PENDING = TX_AGREEMENT_PENDING;
  public TX_AGREED = TX_AGREED;
  public TX_INVEST_PENDING = TX_INVEST_PENDING;
  public TX_INVESTED = TX_INVESTED;

  public explorerUrl = (<any>env).BLOCK_EXPLORER_URL;

  @Input() public offer: Offer;
  @Input() public collapsed: boolean;

  public errorMessages: any[] = [];

  constructor(private assetProtocol: InvestmentAssetService,
    private offerService: OfferService,
    private toastrService: ToastrService,
    private i18nService: I18nService,
    private linkService: LinkService,
    private walletService: WalletService,
    private errorLogService: ErrorLogService) { }

  ngOnInit() { }

  public calculatePaybackDate(asset) {
    const paybackDate = new Date(asset.investedIn);
    paybackDate.setMonth(paybackDate.getMonth() + this.offer.paybackMonths);
    return paybackDate;
  }

  public toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  public acceptInvestor(offerUuid, asset) {
    const id = '1';
    const ethusd = 340.0;
    const agreementTermsHash = '67e49469e62a9805e43744ec4437a6dcf6c6bc36d6a33be837e95b8d325816ed';
    const value = asset.value / ethusd;

    this.offerService.acceptInvestor(offerUuid, asset).then(data => {
      this.errorLogService.setClassName('ConfirmOfferComponent');
      this.errorLogService.setFunctionName('confirmOffer');
      // Improve this call
      this.walletService.getEthBalance().then((balance) => {
        this.errorLogService.setBeforeETHbalance(balance);
      });

      this.assetProtocol.agreeInvestment(data.event.uuid, asset.investorWallet, agreementTermsHash, value, asset.contractAddress,
        (success) => {
          console.log(success);
          this.toastrService.getInstance().success('Your agreement was mined by the Ethereum blockchain.');
        }, (error) => {
          this.errorLogService.setError(error);
          // Improve this call
          this.walletService.getEthBalance().then((balance) => {
            this.errorLogService.setAfterETHbalance(balance);
          });
          console.log(error);
          this.toastrService.getInstance().error(error.message);
        }
      );
      asset.status = TX_AGREEMENT_PENDING;
    }, error => {
      const namespace = 'agree-investment';

      this.i18nService.doTranslateList(namespace, error).then(res => {
        this.errorMessages = res; // errorMessages is a list of error strings
      });
    });
  }

  public exploreContract(address: string) {
    const url = this.explorerUrl + address;
    this.linkService.openLink(url);
  }

  public statusToString(status) {
    let statusString;
    switch (status) {
      case this.TX_CREATION_PENDING:
        statusString = 'Pending Ethereum confirmation';
        break;
      case this.TX_CREATED:
        statusString = 'Available';
        break;
      case this.LOCKED:
        statusString = 'Pending your confirmation';
        break;
      case this.TX_AGREEMENT_PENDING:
        statusString = 'Pending Ethereum confirmation';
        break;
      case this.TX_AGREED:
        statusString = 'Pending investor transfer';
        break;
      case this.TX_INVEST_PENDING:
        statusString = 'Pending Ethereum confirmation from investor transfer';
        break;
      case this.TX_INVESTED:
        statusString = 'Sold';
        break;
    }
    return statusString;
  }

}
