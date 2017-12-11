import { Component, OnInit, Input } from '@angular/core';
import { Offer } from '../../../common/interfaces/offer.interface';
import { I18nService } from '../../../common/services/i18n.service';
import { ToastrService } from '../../../common/services/toastr.service';
import { LinkService } from '../../../common/services/link.service';
import { WalletService } from '../../../common/services/wallet.service';
import { ErrorLogService } from '../../../common/services/error-log.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../../common/services/protocol/investment-asset.service';
import { SwapyProtocolService as SwapyProtocol } from '../../../common/services/protocol/swapy-protocol.service';
import {
  AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, RETURNED,
  DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../../common/interfaces/offerAssetStatus.interface';

import * as env from '../../../../../env.json';

@Component({
  selector: 'app-dashboard-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public PENDING_ETHEREUM_CONFIRMATION = PENDING_ETHEREUM_CONFIRMATION;

  public explorerUrl = (<any>env).BLOCK_EXPLORER_URL;

  @Input() public offer: Offer;
  @Input() public collapsed: boolean;

  public errorMessages: any[] = [];

  constructor(private assetProtocol: InvestmentAssetService,
    private swapyProtocol: SwapyProtocol,
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

  public exploreContract(address: string) {
    const url = this.explorerUrl + address;
    this.linkService.openLink(url);
  }

  public async withdrawFunds(asset) {
    try {
      await this.swapyProtocol.withdrawFunds(asset.contractAddress);
      this.toastrService.getInstance().success('Your offer was mined by the Ethereum blockchain.');
    } catch (error) {
      this.walletService.getEthBalance().then((currentBalance) => {
        this.errorLogService.setAfterETHbalance(currentBalance);
        this.errorLogService.setError(error);
      });
      this.toastrService.getInstance().error(error.message);
    }
  }

  public async refuseInvestment(asset) {
    try {
      await this.swapyProtocol.refuseInvestment(asset.contractAddress);
      this.toastrService.getInstance().success('Your offer was mined by the Ethereum blockchain.');
    } catch (error) {
      this.walletService.getEthBalance().then((currentBalance) => {
        this.errorLogService.setAfterETHbalance(currentBalance);
        this.errorLogService.setError(error);
      });
      this.toastrService.getInstance().error(error.message);
    }
  }

  public returnInvestment(asset) {
    const value = asset.value * (1 + this.offer.grossReturn);
    this.assetProtocol.returnInvestment(asset.contractAddress, value, (success) => {
      this.toastrService.getInstance().success('Your investment return was mined by the Ethereum blockchain.');
    }, (error) => {
      this.toastrService.getInstance().error(error.message);
    });
  }

  public statusToString(status) {
    let statusString;
    switch (parseInt(status, 10)) {
      case this.PENDING_ETHEREUM_CONFIRMATION:
        statusString = 'Pending Ethereum confirmation';
        break;
      case this.PENDING_OWNER_AGREEMENT:
        statusString = 'Pending agreement';
        break;
      case this.AVAILABLE:
        statusString = 'Available';
        break;
      case this.INVESTED:
        statusString = 'Successfully invested';
        break;
      case this.RETURNED:
        statusString = 'Successfully returned';
        break;
      case this.DELAYED_RETURN:
        statusString = 'Delayed';
        break;
    }
    return statusString;
  }
}
