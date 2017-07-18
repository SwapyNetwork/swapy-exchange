import { Component } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';  

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'credit-company-root',
  templateUrl: './credit-company.component.html',
  styleUrls: ['./credit-company.component.css']
})
export class CreditCompanyComponent {
  title = 'credit-company';
}
