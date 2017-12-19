import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  public assets = [];
  constructor() { }

  ngOnInit() {
  }

  public async getAssetsForSale() {
  }

}
