import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { AddOfferService } from './add-offer.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.css']
})
export class AddOfferComponent implements OnInit {

  public amount: string;
  public paybackMonths: string;
  public grossReturn: string;
  public assetsNumber: number;

  public paybackMonthsMask = [/\d/, /\d/];

  public amountMask = createNumberMask({
    prefix: 'US$ ',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
  });

  public percentMask = createNumberMask({
    prefix: '',
    suffix: ' %',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
  });

  constructor(private addOfferService: AddOfferService, private router: Router) {}

  ngOnInit() {
    this.paybackMonths = '12'; // Temporary default value
  }

  addOffer() {
    this.paybackMonths = '12'; // Making sure that this is going to be the default value even if a user edits the HTML.
    const raisingAmount = parseFloat(this.amount.replace(/[^0-9.]/g, ''));
    const assets = [];

    // For now it's fixed in assets of the same value. Later on, the company will be able to choose the assets' values
    for (let i = 0; i < this.assetsNumber; i++) {
      assets.push(
        {
          value: parseFloat((raisingAmount / this.assetsNumber).toFixed(2)),
          collateral: 0
        }
      );
    };

    const offer = {
      raisingAmount,
      grossReturn: (parseFloat(this.grossReturn.replace(/[^0-9.]/g, '')) / 100).toFixed(4),
      paybackMonths: parseInt(this.paybackMonths, 10),
      assets
    }

    this.addOfferService.cacheOffer(offer);
    this.router.navigate(['credit-company/raise/confirm']);
  }

}
