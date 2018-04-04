import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplyTokenService } from './supply-token.service';
import { ToastrService } from '../../common/services/toastr.service';
import { PendingOfferService } from '../pending-offer/pending-offer.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'app-supply-token',
  templateUrl: './supply-token.component.html',
  styleUrls: ['./supply-token.component.css']
})
export class SupplyTokenComponent implements OnInit {

  public asset;
  public amount;

  public amountMask = createNumberMask({
    prefix: '',
    suffix: ' SWAPY tokens',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: false,
  });

  constructor(
    private router: Router,
    private swapyProtocol: SwapyProtocol,
    private toastrService: ToastrService,
    private supplyTokenService: SupplyTokenService,
    private pendingOfferService: PendingOfferService
  ) { }

  ngOnInit() {
    this.asset = this.supplyTokenService.getCachedAsset();
  }

  public async transferToken() {
    this.router.navigate(['/credit-company/raise/pending']);
    this.amount = parseFloat(this.amount.replace(/[^0-9.]/g, '')) * Math.pow(10, 18);
    try {
      setTimeout(() => {
        this.pendingOfferService.setMessage('Wait for transaction and then supply it (another transaction will be required).');
      }, 10)
      await this.swapyProtocol.transferToken(this.asset.contractAddress, this.amount);
      this.toastrService.getInstance().success('You transfered the token, please supply it now.');
      this.supplyTokenFuel();
      this.pendingOfferService.setMessage('You transfered the token, please supply it now.');
    } catch (error) {
      this.toastrService.error(error.message);
      this.pendingOfferService.setErrorMessage(error.message);
    }
  }

  public async supplyTokenFuel() {
    try {
      await this.swapyProtocol.supplyTokenFuel(this.asset.contractAddress, this.amount);
      this.toastrService.getInstance().success('Token succesfully supplied.');
      this.pendingOfferService.setMessage('Token succesfully supplied.');
    } catch (error) {
      this.toastrService.error(error.message);
      this.pendingOfferService.setErrorMessage(error.message);
    }
  }

}
