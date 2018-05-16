import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';
import { InvestorComponent } from '../investor.component';
import { ToastrService } from '../../common/services/toastr.service';
import { StorageService } from '../../common/services/storage.service';
import { MessageService } from '../../common/message/message.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { Web3Service } from '../../common/services/web3.service';

import * as sha1 from 'sha1';

@Component({
  selector: 'app-require-token',
  templateUrl: './require-token.component.html',
  styleUrls: ['./require-token.component.css']
})
export class RequireTokenComponent implements OnInit {

  public assets;

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public FOR_SALE = FOR_SALE;
  public PENDING_INVESTOR_AGREEMENT = PENDING_INVESTOR_AGREEMENT;
  public PENDING_ETHEREUM_CONFIRMATION = PENDING_ETHEREUM_CONFIRMATION;

  constructor(
    private storageService: StorageService,
    private swapyProtocol: SwapyProtocol,
    private toastrService: ToastrService,
    private messageService: MessageService,
    public investorComponent: InvestorComponent,
    private web3Service: Web3Service,
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit() {
    this.assets = this.dashboardService.getDelayed();
  }

  public calculateReturnAmount(asset) {
    return asset.value * (1 + asset.grossReturn);
  }

  public calculatePaybackDate(asset) {
    const paybackDate = new Date(asset.investedAt);
    paybackDate.setMonth(paybackDate.getMonth() + asset.paybackMonths);
    return paybackDate;
  }

  public calculateAssetProgression(asset) {
    const paybackDate = new Date(asset.investedAt);
    const now = new Date();
    const monthsDiff = (now.getFullYear() * 12 + now.getMonth()) - (paybackDate.getFullYear() * 12 + paybackDate.getMonth());
    return monthsDiff;
  }

  public statusToString(status) {
    let statusString;
    switch (status) {
      case this.AVAILABLE:
        statusString = '';
        break;
      case this.PENDING_OWNER_AGREEMENT:
        statusString = 'Waiting';
        break;
      case this.INVESTED:
        statusString = 'Invested';
        break;
      case this.RETURNED:
        statusString = 'Returned';
        break;
      case this.FOR_SALE:
        statusString = 'On sale';
        break;
      case this.PENDING_INVESTOR_AGREEMENT:
        statusString = 'Waiting';
        break;
      case this.DELAYED_RETURN:
        statusString = 'Delayed return';
        break;
      case this.PENDING_ETHEREUM_CONFIRMATION:
        statusString = 'Pending transaction confirmation';
        break;
    }

    return statusString;

  }

  public async requireTokens() {
    this.router.navigate(['investor/message']);
    const contractAddresses = this.assets.map(asset => asset.contractAddress);
    try {
      await this.swapyProtocol.requireToken(contractAddresses);
      
      /* Maybe will need it in the future.
      const transactionHash = this.storageService.getItem(contractAddresses[0]);
      const receipt = await this.web3Service.getInstance().eth.getTransactionReceipt(transactionHash);
      console.log(receipt);
      */
      
      this.toastrService.getInstance().success('Token successfully required.');
      this.messageService.setLastMessage('Token successfully required.');
      this.messageService.setHeaderMessage('Transaction confirmed');
    } catch (error) {
      let errorMessage
      if (sha1(error.message) === '699e7c6d81ba58075ee84cf2a640c18a409efcba') { // 50 blocks later and transaction has not being mined yet.
        errorMessage = 'Transaction is still being mined. Check it out later to see if the transaction was mined'
        this.toastrService.getInstance().error(errorMessage);
        this.messageService.setErrorMessage(errorMessage);
      } else if (error.message.toLowerCase().indexOf('user denied transaction signature') !== - 1) {
        errorMessage = 'User denied transaction signature';
        this.toastrService.getInstance().error(errorMessage);
        this.messageService.setErrorMessage(errorMessage);
      } else {
        errorMessage = 'Not eligible to receive SWAPY Tokens. Investment return is not delayed yet.';
        this.toastrService.getInstance().error(errorMessage);
        this.messageService.setErrorMessage(errorMessage);
      }
    }
  }

}
