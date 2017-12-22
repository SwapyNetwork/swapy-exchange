import { Component, OnInit } from '@angular/core';
import { InvestService } from './../invest/invest.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { WalletService } from '../../common/services/wallet.service';
import { Web3Service } from '../../common/services/web3.service';
import { LoadingService } from '../../common/services/loading.service';
import { DashboardService } from './dashboard.service';
import { InvestorComponent } from '../investor.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public investments;
  constructor(private dashboardService: DashboardService,
    private loadingService: LoadingService, private investorComponent: InvestorComponent) { }

  ngOnInit() {
    this.updateInvestments();
  }

  public updateInvestments() {
    this.loadingService.show();

    this.dashboardService.getMyInvestmentsFromBlockchain().then(investments => {
      this.investments = investments;
      this.investorComponent.refreshStatusBar();
    })
    this.loadingService.hide();
  }
}
