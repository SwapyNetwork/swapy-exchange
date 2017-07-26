import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginService} from './login.service';
import {Router} from '@angular/router';
import { LoginResponseModel, INVESTOR, CREDIT_COMPANY } from './login-response.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	public email: string = '';
	public password: string = '';

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {}

  login() {
    /** @todo frontend validations */

  	let body = {
  		email: this.email,
  		password: this.password
  	};

    this.loginService.login(body).then(
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
