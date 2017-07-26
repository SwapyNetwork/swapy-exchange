import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LogoutService} from '../services/logout.service';
import {StorageService} from '../services/storage.service';
import {UserResponseModel} from '../models/user-response.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public user: UserResponseModel;

  constructor(public logoutService: LogoutService, private storageService: StorageService, private router: Router) {
    let user = this.storageService.getItem('user');
    this.user = user ? user : {};
  }

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
