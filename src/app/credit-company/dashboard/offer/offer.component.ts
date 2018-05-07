import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Offer } from '../../../common/interfaces/offer.interface';
import { I18nService } from '../../../common/services/i18n.service';
import { ToastrService } from '../../../common/services/toastr.service';
import { LinkService } from '../../../common/services/link.service';
import { WalletService } from '../../../common/services/wallet.service';
import { ErrorLogService } from '../../../common/services/error-log.service';
import { DashboardService } from '../dashboard.service';
import { AssetMathService as AssetMath } from '../../../common/services/asset-math.service';
import { SwapyProtocolService as SwapyProtocol } from '../../../common/services/swapy-protocol.service';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT, RETURNED,
  DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../../common/interfaces/offer-asset-status.interface';
import { StorageService } from '../../../common/services/storage.service';

const env = require('../../../../../env.json');
import * as sha1 from 'sha1';


@Component({
  selector: 'app-dashboard-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public FOR_SALE = FOR_SALE;
  public PENDING_INVESTOR_AGREEMENT = PENDING_INVESTOR_AGREEMENT;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public PENDING_ETHEREUM_CONFIRMATION = PENDING_ETHEREUM_CONFIRMATION;

  public explorerUrl = (<any>env).BLOCK_EXPLORER_URL;

  @Input() public assets;
  @Input() public offer: Offer;
  @Input() public collapsed: boolean;

  public errorMessages: any[] = [];

  constructor(
    private swapyProtocol: SwapyProtocol,
    private toastrService: ToastrService,
    private i18nService: I18nService,
    private linkService: LinkService,
    private walletService: WalletService,
    private storageService: StorageService,
    private router: Router,
    private assetMath: AssetMath,
    private dashboardService: DashboardService,
    private errorLogService: ErrorLogService) { }

  ngOnInit() {};

  public selectAsset(assetToSelect) {
    assetToSelect.selected = assetToSelect.selected === 0 ? 1 : 0;
    const count = this.assets.filter(asset => asset.selected === 1).length;
    if (count === 1) {
      this.assets.forEach(asset => {
        if (asset.status !== assetToSelect.status) {
          asset.selected = -1;
        }
      });
    } else {
      if (count === 0) {
        this.assets.forEach(asset => {
          asset.selected = 0;
        });
      }
    }

    this.dashboardService.setSelectedAssets(this.assets.filter(asset => asset.selected === 1));
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
