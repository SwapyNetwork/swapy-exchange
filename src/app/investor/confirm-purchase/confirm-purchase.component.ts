import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketplaceService } from '../marketplace/marketplace.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { ToastrService } from '../../common/services/toastr.service';
import { SuccessfulInvestmentService } from './../successful-investment/successful-investment.service';

@Component({
  selector: 'app-confirm-purchase',
  templateUrl: './confirm-purchase.component.html',
  styleUrls: ['./confirm-purchase.component.css']
})
export class ConfirmPurchaseComponent implements OnInit {

  public asset;
  constructor(
    private marketplaceService: MarketplaceService,
    private swapyProtocol: SwapyProtocol,
    private toastrService: ToastrService,
    private successfulInvestmentService: SuccessfulInvestmentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.asset = this.marketplaceService.getCachedAsset();
  }

  public async confirmPurchase() {
    // this.router.navigate(['investor/invest/success']);
    try {
      await this.swapyProtocol.buyAsset(this.asset.address, this.asset.value);
      this.toastrService.getInstance().success('Purchase requested');
      this.successfulInvestmentService.setMessage('Your investment was mined by the Ethereum blockchain.');
    } catch (error) {
      this.toastrService.error(error.message);
      this.successfulInvestmentService.setErrorMessage(error.message);
    }

  }

  public calculateAssetProgression() {
    const paybackDate = new Date(this.asset.investedAt);
    const now = new Date();
    const monthsDiff = (now.getFullYear() * 12 + now.getMonth()) - (paybackDate.getFullYear() * 12 + paybackDate.getMonth());
    return monthsDiff;
  }

  public calculatePaybackDate() {
    const paybackDate = new Date(this.asset.investedAt);
    paybackDate.setMonth(paybackDate.getMonth() + this.asset.paybackMonths);
    return paybackDate;
  }

  public porcentageProgression() {
    const porcentage = this.calculateAssetProgression() * 100 / this.asset.paybackMonths;
    return Math.floor(porcentage / 5) * 5;
  }

}
