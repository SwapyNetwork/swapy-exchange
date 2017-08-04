import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import createNumberMask from 'text-mask-addons/src/createNumberMask';

import { AddOfferService } from './add-offer.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.css']
})
export class AddOfferComponent implements OnInit {

  public amount: string;
  public paybackMonths: string;
  public roi: string;

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

  ngOnInit() {}

  addOffer() {
    /** todo text-mask maintains the mask on the model value. When it got fixed, remove the replacing */
    let offer = {
      raisingAmount: parseFloat(this.amount.replace(/[^0-9.]/g, '')),
      roi: (parseFloat(this.roi.replace(/[^0-9.]/g, ''))/100).toFixed(4),
      paybackMonths: parseInt(this.paybackMonths)
    }
    /** @todo In the HTML months input, add a mask to only accept input from numbers*/

    this.addOfferService.cacheOffer(offer);
    this.router.navigate(["credit-company/raise/confirm"]);
  }

}
