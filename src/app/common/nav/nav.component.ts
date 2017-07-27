import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../services/logout.service';
import { StorageService } from '../services/storage.service';
import { UserResponseModel, INVESTOR, CREDIT_COMPANY } from '../models/user-response.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public user: UserResponseModel;
  public menu:any[];
  public profileUrl:string = '';
  public helpUrl:string = '';

  constructor(public logoutService: LogoutService, private storageService: StorageService, private router: Router) {
    let user = this.storageService.getItem('user');
    this.user = user ? user : {};

    switch (this.user.type) {
      case INVESTOR:
        this.menu = [
          {url:"/investor/offers", label: "Invest"},
          {url:"/investor", label: "Manage"}
        ];
        this.profileUrl = '/investor/profile';
        this.helpUrl = '/investor/help';
        break;
      case CREDIT_COMPANY:
        this.menu = [
          {url:"/credit-company/add-offer", label: "Raise"},
          {url:"/credit-company", label: "Manage"}
        ];
        this.profileUrl = '/credit-company/profile';
        this.helpUrl = '/credit-company/help';
        break;
    }

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
