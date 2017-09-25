import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { InvestorService } from './investor.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'investor-root',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.css']
})
export class InvestorComponent {
  title = 'investor';

  public assetsLength;
  public investedValue;
  public averageReturn;
  public returnValue;
  public averagePaybackPeriod;

  constructor(private investorService: InvestorService) {};

  ngOnInit() {
    this.refreshStatusBar();
  };

  refreshStatusBar(){
    this.investorService.getMyInvestmnetsInfo().then((data: any) => {
      this.assetsLength = data.assetsLength;
      this.investedValue = data.investedValue;
      this.averageReturn = data.averageReturn;
      this.returnValue = data.returnValue;
      this.averagePaybackPeriod = data.averagePaybackPeriod;
    });
  };
}
