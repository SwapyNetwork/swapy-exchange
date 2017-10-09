import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginService} from './login.service';
import {Router} from '@angular/router';
import { LoginResponseModel } from './login-response.model';
import { UserResponseInterface, INVESTOR, CREDIT_COMPANY } from '../../common/interfaces/user-response.interface';
import { I18nService } from '../../common/services/i18n.service';
import { Web3Service } from '../../common/services/web3.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string = '';
  public password: string = '';
  public errorMessages:string[] = [];
  private web3;

  constructor(private loginService: LoginService, private i18nService: I18nService, private router: Router, private web3Service: Web3Service) { }

  ngOnInit() {
    this.web3Service.init();
    this.web3 = this.web3Service.getInstance();
  }

  login() {
    /** @todo frontend validations */

    let body = {
      email: this.email,
      password: this.password
    };

    this.loginService.login(body).then(
      // Successful responses call the first callback.
      (data: LoginResponseModel) => {
        console.log(data.user);
        this.router.navigate([this.solveRoute(data.user.type, data.user.tfa)]);
      },
      // Errors will call this callback instead:
      err => {
        let namespace = "login";

        // i18nService read language files and translate message by code
        // in case message not exists under the namespace file + language
        // uses the default message
        this.i18nService.doTranslateList(namespace, err.error).then( res => {
          this.errorMessages = res; // errorMessages is a list of error strings
        });
      }
    );
  }

  private solveRoute(userType: number, tfa: boolean) {
    if(tfa) return '/2fa/validation';
    switch (userType) {
      case INVESTOR:
        return '/investor';
      case CREDIT_COMPANY:
        return '/credit-company';
      default:
        return '/';
    }
  }

}
