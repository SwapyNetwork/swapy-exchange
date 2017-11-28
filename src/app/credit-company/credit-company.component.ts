import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
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

  constructor(private walletService: WalletService) {};

  ngOnInit() {
    this.refreshStatusBar();
  };

  refreshStatusBar() { /**@todo Refresh via websocket when a investment is done */
    this.walletService.getEthBalance().then((balance) => {
      this.balance = balance;
    }, (error) => {
      console.error(error);
    });
  };
}
