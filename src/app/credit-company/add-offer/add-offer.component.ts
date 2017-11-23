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
  public errorMessages: string[] = [];

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
    this.paybackMonths = '12'; // Temporary setting default value
  }

  addOffer() {
    /** @todo frontend validations */
    this.errorMessages = [];
    /** todo text-mask maintains the mask on the model value. When it got fixed, remove the replacing */
    const raisingAmount = parseFloat(this.amount.replace(/[^0-9.]/g, ''));
    const assets = [];

    // For now it's fixed in 5 assets of the same value. Later on, the company will be able to choose the assets' values
    for (let i = 0; i < 5; i++) {
      assets.push({value: parseFloat((raisingAmount / 5).toFixed(2))});
    }

    const offer = {
      raisingAmount,
      grossReturn: (parseFloat(this.grossReturn.replace(/[^0-9.]/g, '')) / 100).toFixed(4),
      paybackMonths: parseInt(this.paybackMonths, 10),
      assets
    }
    /** @todo In the HTML months input, add a mask to only accept input from numbers*/

    this.addOfferService.cacheOffer(offer);
    this.router.navigate(['credit-company/raise/confirm']);
  }

}
