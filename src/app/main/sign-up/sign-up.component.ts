import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { SignUpService } from './sign-up.service';
import { LoginResponseModel } from '../login/login-response.model';
import { INVESTOR, CREDIT_COMPANY } from '../../common/interfaces/user-response.interface';
import { I18nService } from '../../common/services/i18n.service';

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
  public agreedToTerms: boolean = false;
  public errorMessages:string[] = [];

  constructor(private signUpService: SignUpService, private i18nService: I18nService, private router: Router) { }

  ngOnInit() {}

  signUp() {
    /** @todo frontend validations */
    this.errorMessages = [];

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
      agreedToTerms: this.agreedToTerms
    };

    if(this.validateForm()){

      this.signUpService.signUp(body).then(
        // Successful responses call the first callback.
        (data: LoginResponseModel) => {
          this.router.navigate([this.solveRoute(data.user.type)]);
        },
        // Errors will call this callback instead:
        err => {
          let namespace = "sign-up";

          this.i18nService.doTranslateList(namespace, err.error).then( res => {
            this.errorMessages = res; // errorMessages is a list of error strings
          });
        }
      );

    }

  }

  private validateForm(){
    if(this.password != this.confirmPassword)
      this.errorMessages.push('Passwords must match.');

    if(this.agreedToTerms == false)
      this.errorMessages.push('You must agree to our terms of services and privacy policy.');

    return this.errorMessages.length == 0;
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
