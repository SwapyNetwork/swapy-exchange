import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AssetMathService as AssetMath } from '../../common/services/asset-math.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { ToastrService } from '../../common/services/toastr.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT, RETURNED,
  DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';
import { CreditCompanyComponent } from '../credit-company.component';

@Component({
  selector: 'app-return-investment',
  templateUrl: './return-investment.component.html',
  styleUrls: ['./return-investment.component.css']
})
export class ReturnInvestmentComponent implements OnInit {

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public FOR_SALE = FOR_SALE;
  public PENDING_INVESTOR_AGREEMENT = PENDING_INVESTOR_AGREEMENT;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public PENDING_ETHEREUM_CONFIRMATION = PENDING_ETHEREUM_CONFIRMATION;

  public assets;
  public total;

  constructor(
    private swapyProtocol: SwapyProtocol,
    private toastrService: ToastrService,
    private creditCompanyComponent: CreditCompanyComponent,
    private dashboardService: DashboardService,
    private assetMath: AssetMath
  ) { }

  ngOnInit() {
    this.assets = this.dashboardService.getSelectedAssets();
    this.total = this.assets.map(asset => this.assetMath.calculateReturnAmount(asset)).reduce((last, current) => last += current);
  }

  private onError(error) {
    this.toastrService.error(error.message);
    // this.messageService.setErrorMessage(error.message);
  }

  public async returnInvestment() {
    const contractAddresses = this.assets.map(asset => asset.contractAddress);
    const values = this.assets.map(asset => (asset.value * (1 + asset.grossReturn)).toFixed(2));
    try {
      await this.swapyProtocol.returnInvestment(contractAddresses, values);
      this.toastrService.getInstance().success('Investment(s) returned');
      // this.messageService.setLastMessage('Sell order(s) cancelled');
      // this.messageService.setHeaderMessage('Transaction confirmed');
    } catch (error) {
      this.onError(error);
    }
  }

  public statusToString(status) {
    let statusString;
    switch (parseInt(status, 10)) {
      case this.PENDING_ETHEREUM_CONFIRMATION:
        statusString = 'Pending transaction confirmation';
        break;
      case this.PENDING_OWNER_AGREEMENT:
        statusString = 'Waiting';
        break;
      case this.AVAILABLE:
        statusString = 'Available';
        break;
      case this.INVESTED:
      case this.FOR_SALE:
      case this.PENDING_INVESTOR_AGREEMENT:
        statusString = 'Invested';
        break;
      case this.RETURNED:
        statusString = 'Returned';
        break;
      case this.DELAYED_RETURN:
        statusString = 'Delayed return';
        break;
    }
    return statusString;
  }

}
