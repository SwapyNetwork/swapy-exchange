import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LogoutService} from '../services/logout.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public logoutService: LogoutService, private router: Router) { }

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

  public logout() {
    this.logoutService.logout().then(
      data => {
        console.log(data);
        this.router.navigate(['/']);
      },
      err => {
        console.log(err);
      }
    );
  }

}
