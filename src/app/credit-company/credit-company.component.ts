import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { CreditCompanyService } from './credit-company.service';
import { WalletService } from '../common/services/wallet.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'credit-company-root',
  templateUrl: './credit-company.component.html',
  styleUrls: ['./credit-company.component.css']
})
export class CreditCompanyComponent implements OnInit {
  title = 'credit-company';

  public amountRequested;
  public amountRaised;
  public offersLength;
  public balance;

  constructor(private creditCompanyService: CreditCompanyService, private walletService: WalletService) {};

  ngOnInit() {
    this.refreshStatusBar();
  };

  refreshStatusBar() { /**@todo Refresh via websocket when a investment is done */
    this.creditCompanyService.getMyOffersInfos().then(
      (data: any) => {
        this.amountRequested = data.amountRequested;
        this.amountRaised = data.amountRaised;
        this.offersLength = data.offersLength;
        this.walletService.getEthBalance().then((balance) => {
          this.balance = balance;
        }, (error) => {
          console.error(error);
        });
      },
      (error: any) => {
        console.error(error);
      }
    );
  };
}
