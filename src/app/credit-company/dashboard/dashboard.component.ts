import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { WalletService } from '../../common/services/wallet.service';
import { Web3Service } from '../../common/services/web3.service';
import { LoadingService } from '../../common/services/loading.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DashboardService } from './dashboard.service';
import { CreditCompanyComponent } from '../credit-company.component';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public offers;
  public selectedAssets;

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public FOR_SALE = FOR_SALE;
  public PENDING_INVESTOR_AGREEMENT = PENDING_INVESTOR_AGREEMENT;
  public PENDING_ETHEREUM_CONFIRMATION = PENDING_ETHEREUM_CONFIRMATION;

  constructor(
    private walletService: WalletService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private dashboardService: DashboardService,
    private creditCompanyComponent: CreditCompanyComponent,
    private toastr: ToastsManager, vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.updateOffers();
  }

  public async updateOffers() {
    this.loadingService.show();
    this.offers = await this.dashboardService.updateOffers();
    this.creditCompanyComponent.refreshBalance();
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
