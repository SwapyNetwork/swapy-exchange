import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(
    private dashboardService: DashboardService,
    private loadingService: LoadingService,
    private walletService: WalletService,
    private investorComponent: InvestorComponent,
    private router: Router
  ) { }

  async ngOnInit() {
    const ethBalance = await this.walletService.getEthBalance();
    if (ethBalance === 0) {
      this.router.navigate(['/investor/add-funds']);
    } else {
      await this.updateInvestments();
      if (this.investments.length === 0) {
        this.router.navigate(['/investor/start-investing']);
      }
    }
  }

  public async updateInvestments() {
    this.loadingService.show();

    this.investments = await this.dashboardService.getMyInvestmentsFromBlockchain()
    this.investorComponent.refreshBalance();
    this.loadingService.hide();
  }
}
