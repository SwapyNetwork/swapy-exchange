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
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public assets;
  public selectedAssets;
  public walletAddress;

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public FOR_SALE = FOR_SALE;
  public PENDING_INVESTOR_AGREEMENT = PENDING_INVESTOR_AGREEMENT;
  public PENDING_ETHEREUM_CONFIRMATION = PENDING_ETHEREUM_CONFIRMATION;

  constructor(
    private dashboardService: DashboardService,
    private loadingService: LoadingService,
    private walletService: WalletService,
    private investorComponent: InvestorComponent,
    private router: Router
  ) { }

  async ngOnInit() {
    this.walletAddress = this.walletService.getWallet().address.toLowerCase();
    this.dashboardService.setSelectedAssets([]);
    const ethBalance = await this.walletService.getEthBalance();
    if (ethBalance === 0) {
      this.router.navigate(['/investor/add-funds']);
    } else {
      await this.updateInvestments();
      if (this.assets.length === 0) {
        this.router.navigate(['/investor/start-investing']);
      } else {
        this.investorComponent.refreshBalance();
      }
    }
  }

  public async updateInvestments() {
    this.loadingService.show();

    this.assets = await this.dashboardService.getMyInvestmentsFromBlockchain();
    // this.investorComponent.refreshBalance();
    this.loadingService.hide();
  }

  public handleButtons() {
    this.selectedAssets = this.dashboardService.getSelectedAssets();
    return {
      status: this.selectedAssets[0].status,
      investor: this.selectedAssets[0].investor
    }
  }

  public checkSelectedAssets() {
    if (this.dashboardService.getSelectedAssets() === undefined) {
      return 0;
    }
    return this.dashboardService.getSelectedAssets();
  }


}
