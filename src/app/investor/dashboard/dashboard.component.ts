import { Component, OnInit } from '@angular/core';
import { InvestService } from './../invest/invest.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public investments;

  constructor(private investService: InvestService) { }

  ngOnInit() {
    this.investService.getMyInvestments().then(
      (data:any) => {
        this.investments = data.investments;
      },
      (error:any) => {
        console.log(error)
      }
    );
  }

}
