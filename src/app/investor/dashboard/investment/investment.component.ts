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

}
