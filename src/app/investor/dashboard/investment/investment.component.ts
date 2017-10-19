import { Component, OnInit, Input } from '@angular/core';
import { Invest } from '../../invest/invest.interface';
import { OPEN, SOLD, PENDING, LOCKED, TX_AGREEMENT_PENDING,
  TX_AGREED, TX_INVEST_PENDING, TX_INVESTED } from '../../../common/interfaces/offerAssetStatus.interface';
import { LinkService } from '../../../common/services/link.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../../common/services/protocol/investment-asset.service';
import { InvestService } from '../../invest/invest.service';

import * as env from '../../../../../env.json';

@Component({
  selector: 'app-dashboard-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css']
})
export class InvestmentComponent implements OnInit {

  @Input() public investment: Invest;
  @Input() public collapsed: boolean;

  public OPEN = OPEN;
  public SOLD = SOLD;
  public PENDING = PENDING;
  //
  public LOCKED = LOCKED;
  public TX_AGREEMENT_PENDING = TX_AGREEMENT_PENDING;
  public TX_AGREED = TX_AGREED;
  public TX_INVEST_PENDING = TX_INVEST_PENDING;
  public TX_INVESTED = TX_INVESTED;

  public explorerUrl = (<any>env).BLOCK_EXPLORER_URL;

  constructor(private linkService: LinkService, private investmentAssetService: InvestmentAssetService, private investService: InvestService) { }

  ngOnInit() {
  }

  public toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  public calculateReturnAmount() {
    return this.investment.totalAmount * (1 + this.investment.roi);
  }

  public calculatePaybackDate() {
    const paybackDate = new Date(this.investment.investedIn);
    paybackDate.setMonth(paybackDate.getMonth() + this.investment.paybackMonths);
    return paybackDate;
  }

  public statusToString(status) {
    let statusString;
    switch (status) {
      case this.LOCKED:
        statusString = 'Pending ' + this.investment.companyName + '\'s confirmation';
        break;
      case this.TX_AGREEMENT_PENDING:
        statusString = 'Pending ' + this.investment.companyName + '\'s confirmation';
        break;
      case this.TX_AGREED:
        statusString = 'Asset accepted by ' + this.investment.companyName;
        break;
      case this.TX_INVEST_PENDING:
        statusString = 'Pending Ethereum confirmation';
        break;
      case this.TX_INVESTED:
        statusString = 'Asset succesfully invested';
        break;
    }

    return statusString;

  }

  public exploreContract(address: string) {
    const url = this.explorerUrl + address;
    this.linkService.openLink(url);
  }

  public transferFunds(investment: any, asset: any) {
    this.investService.transferFunds({
      offerUuid: investment.offerUuid,
      assetUuid: asset.uuid,
      companyUuid: investment.companyUuid,
    }).then(res => {
      asset.status = this.TX_INVEST_PENDING;
      const ethusd = 340.0;
      const agreementTermsHash = '67e49469e62a9805e43744ec4437a6dcf6c6bc36d6a33be837e95b8d325816ed';
      const value = asset.value / ethusd;
      // should be event.id
      this.investmentAssetService.transferFunds((res as any).event.uuid, agreementTermsHash, asset.contractAddress, value);
    }, err => {
      console.log(err);
    });
  }

}
