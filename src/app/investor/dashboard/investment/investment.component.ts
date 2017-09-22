import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dashboard-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css']
})
export class InvestmentComponent implements OnInit {

  @Input() public investment;
  @Input() public collapsed: boolean;

  constructor() { }

  ngOnInit() {
  }

  public toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  public calculateReturnAmount(){
    return this.investment.totalAmount * (1 + this.investment.roi);
  }

  public calculatePaybackDate() {
    const paybackDate = new Date(this.investment.investedIn);
    paybackDate.setMonth(paybackDate.getMonth() + this.investment.paybackMonths);
    return paybackDate;
  }

}
