import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

	// store state
  isIn = false;
  isSettingsOpen = false;

	// click handler
  public toggleState() { 
    let bool = this.isIn;
    this.isIn = bool === false ? true : false; 
  }

	public toggleSettingsDropdown() { 
    let bool = this.isSettingsOpen;
    this.isSettingsOpen = bool === false ? true : false; 
  }

}
