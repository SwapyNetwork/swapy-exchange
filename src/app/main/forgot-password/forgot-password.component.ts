import { Component, OnInit } from '@angular/core';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public email: string = '';

  constructor(private forgotPasswordService: ForgotPasswordService) { }

  ngOnInit() {}

  retrivePassword() {
    this.forgotPasswordService.retrivePassword(this.email).then(
      data => {
        console.log(data);
      },
      error => {
        console.error(error);
      }
    );
  }

}
