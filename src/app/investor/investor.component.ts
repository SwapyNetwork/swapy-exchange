import { Component } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';  

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'investor-root',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.css']
})
export class InvestorComponent {
  title = 'investor';
}
