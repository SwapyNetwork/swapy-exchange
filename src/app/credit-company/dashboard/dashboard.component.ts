import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { WalletService } from '../../common/services/wallet.service';
import { Web3Service } from '../../common/services/web3.service';
import { LoadingService } from '../../common/services/loading.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DashboardService } from './dashboard.service';
import { CreditCompanyComponent } from '../credit-company.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public offers;

  constructor(
    private walletService: WalletService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private dashboardService: DashboardService,
    private creditCompanyComponent: CreditCompanyComponent,
    private toastr: ToastsManager, vcr: ViewContainerRef,
    private errorLogService: ErrorLogService) {
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.updateOffers();
  }

  public async updateOffers() {
    this.loadingService.show();
    this.offers = await this.dashboardService.updateOffers();
    this.creditCompanyComponent.refreshStatusBar();
    this.loadingService.hide();
  }
}
