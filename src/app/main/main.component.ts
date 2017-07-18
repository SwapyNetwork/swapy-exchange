import { Component } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';  

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'main-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  title = 'main';
}
