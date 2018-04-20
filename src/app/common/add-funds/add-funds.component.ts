import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { INVESTOR, CREDIT_COMPANY } from '../interfaces/user-type.interface';

@Component({
  selector: 'app-add-funds',
  templateUrl: './add-funds.component.html',
  styleUrls: ['./add-funds.component.css']
})
export class AddFundsComponent implements OnInit {

  public userType;
  public INVESTOR = INVESTOR;
  public CREDIT_COMPANY = CREDIT_COMPANY;

  constructor(
    private storageService: StorageService,
  ) {
    this.userType = this.storageService.getItem('user').type;
   }

  ngOnInit() {
  }

}
