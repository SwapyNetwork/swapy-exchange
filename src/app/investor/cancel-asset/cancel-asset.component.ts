import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';


@Component({
  selector: 'app-cancel-asset',
  templateUrl: './cancel-asset.component.html',
  styleUrls: ['./cancel-asset.component.css']
})
export class CancelAssetComponent implements OnInit {

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
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.assets = this.dashboardService.getSelectedAssets();
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

}
