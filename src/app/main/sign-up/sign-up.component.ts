import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { SignUpService } from './sign-up.service';
import { LoginResponseModel, INVESTOR, CREDIT_COMPANY } from '../login/login-response.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

	public name: string = '';
	public email: string = '';
	public password: string = '';
	public confirmPassword: string = '';
	public type: number = 1;
	public terms: boolean = false;

  constructor(private signUpService: SignUpService, private router: Router) { }

  ngOnInit() {}

  signUp() {
    /** @todo frontend validations */

		var nameParts = this.name.split(/\s(.+)?/);
		var firstName = nameParts[0];
		var lastName = nameParts[1] ? nameParts[1].trim() : null;

  	let body = {
  		firstName: firstName,
  		lastName: lastName,
  		email: this.email,
  		password: this.password,
      confirmPassword: this.confirmPassword,
  		type: this.type,
      terms: this.terms
  	};

    this.signUpService.signUp(body).then(
      // Successful responses call the first callback.
      (data: LoginResponseModel) => {
        this.router.navigate([this.solveRoute(data.user.type)]);
      },
      // Errors will call this callback instead:
      err => {
        /** @todo show error messages */
        console.log(err);
      }
    );

  }

  private solveRoute(userType: number) {
    switch(userType) {
      case INVESTOR:
        return '/investor';
      case CREDIT_COMPANY:
        return '/credit-company';
      default:
        return '/'
    }
  }

}
