import { Component, OnInit } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { DashboardService } from '../dashboard/dashboard.service';
import { AssetMathService as AssetMath } from '../../common/services/asset-math.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT, RETURNED,
  DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { ToastrService } from '../../common/services/toastr.service';

@Component({
  selector: 'app-add-collateral',
  templateUrl: './add-collateral.component.html',
  styleUrls: ['./add-collateral.component.css']
})
export class AddCollateralComponent implements OnInit {

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public FOR_SALE = FOR_SALE;
  public PENDING_INVESTOR_AGREEMENT = PENDING_INVESTOR_AGREEMENT;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public PENDING_ETHEREUM_CONFIRMATION = PENDING_ETHEREUM_CONFIRMATION;

  public collateral = [];
  public token = [];
  public assets;

  public swapyTokenMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: false
  });

  constructor(
    private swapyProtocol: SwapyProtocol,
    private toastrService: ToastrService,
    private dashboardService: DashboardService,
    private assetMath: AssetMath
  ) { }

  ngOnInit() {
    this.assets = this.dashboardService.getSelectedAssets();
    this.assets.forEach(asset => {
      asset.token = 784;
      this.collateral.push(0);
      this.token.push(0);
    });
  }

  private getTotalToken(index) {
    return Number(String(this.collateral[index]).replace(/[^0-9.]/g, '')) + Number(this.assets[index].token);
  }

  private onError(error) {
    this.toastrService.error(error.message);
    // this.messageService.setErrorMessage(error.message);
  }

  private addCollateral() {

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
