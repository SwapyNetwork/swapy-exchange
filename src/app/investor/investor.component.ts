import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WalletService } from '../common/services/wallet.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'investor-root',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.css']
})
export class InvestorComponent implements OnInit {
  title = 'investor';

  public assetsLength;
  public investedValue;
  public averageReturn;
  public returnValue;
  public averagePaybackPeriod;
  public balance;

  constructor(private walletService: WalletService) {};

  ngOnInit() {
    this.refreshStatusBar();
  };

  refreshStatusBar() {
    // this.investorService.getMyInvestmnetsInfo().then((data: any) => {
    //   this.assetsLength = data.assetsLength;
    //   this.investedValue = data.investedValue;
    //   this.averageReturn = data.averageReturn;
    //   this.returnValue = data.returnValue;
    //   this.averagePaybackPeriod = data.averagePaybackPeriod;

      this.walletService.getEthBalance().then((balance) => {
        this.balance = balance;
      }, (error) => {
        console.error(error);
      });
//    });
  };
}
