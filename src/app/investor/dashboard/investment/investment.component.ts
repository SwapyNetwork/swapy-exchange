import { Component, OnInit, Input } from '@angular/core';
import { Invest } from '../../invest/invest.interface';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN } from '../../../common/interfaces/offerAssetStatus.interface';
import { LinkService } from '../../../common/services/link.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../../common/services/protocol/investment-asset.service';
import { ToastrService } from '../../../common/services/toastr.service';
import { InvestService } from '../../invest/invest.service';
import { WalletService } from '../../../common/services/wallet.service';
import { ErrorLogService } from '../../../common/services/error-log.service';

import * as env from '../../../../../env.json';

@Component({
  selector: 'app-dashboard-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css']
})
export class InvestmentComponent implements OnInit {

  @Input() public investment: Invest;
  @Input() public collapsed: boolean;
  //

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public FOR_SALE = FOR_SALE;
  public PENDING_INVESTOR_AGREEMENT = PENDING_INVESTOR_AGREEMENT;

  public explorerUrl = (<any>env).BLOCK_EXPLORER_URL;

  constructor(private linkService: LinkService,
    private investmentAssetService: InvestmentAssetService,
    private investService: InvestService,
    private toastrService: ToastrService,
    private errorLogService: ErrorLogService,
    private walletService: WalletService) { }

  ngOnInit() {
  }

  public toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  public calculateReturnAmount() {
    return this.investment.totalAmount * (1 + this.investment.grossReturn);
  }

  public calculatePaybackDate() {
    const paybackDate = new Date(this.investment.investedIn);
    paybackDate.setMonth(paybackDate.getMonth() + this.investment.paybackMonths);
    return paybackDate;
  }

  public statusToString(status) {
    let statusString;
    switch (status) {
      case this.AVAILABLE:
        statusString = '';
        break;
      case this.PENDING_OWNER_AGREEMENT:
        statusString = 'Pending credit company\'s confirmation';
        break;
      case this.INVESTED:
        statusString = 'Succesfully invested';
        break;
      case this.RETURNED:
        statusString = 'Succesfully returned';
        break;
      case this.FOR_SALE:
        statusString = 'For sale';
        break;
      case this.PENDING_INVESTOR_AGREEMENT:
        statusString = 'Pending investor\'s confirmation';
        break;
      case this.DELAYED_RETURN:
        statusString = 'Delayed return';
        break;
    }

    return statusString;

  }

  public exploreContract(address: string) {
    const url = this.explorerUrl + address;
    this.linkService.openLink(url);
  }

  public cancelInvestment(asset) {
    this.investmentAssetService.cancelInvestment(asset.contractAddress, (success) => {
      this.toastrService.getInstance().success('Cancel investment was mined in the Ethereum blockchain');
    }, (error) => {
      this.toastrService.getInstance().error(error.message);
    })
  }

}
