import { Component, OnInit } from '@angular/core';
import createNumberMask from 'text-mask-addons/src/createNumberMask';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.css']
})
export class AddOfferComponent implements OnInit {

  public amount: String;
  public paybackMonths: String;
  public roi: String;

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

  constructor() {}

  ngOnInit() {}

  addOffer() {
    /** todo text-mask maintains the mask on the model value. When it got fixed, remove the replacing */
    let offer = {
      amount: parseFloat(this.amount.replace(/[^0-9.]/g, '')),
      roi: parseFloat(this.roi.replace(/[^0-9.]/g, ''))/100,
      paybackMonths: this.paybackMonths
    }
    console.log(offer);
  }

}
