import { Component, OnInit } from '@angular/core';
import { ForgotPasswordService } from './forgot-password.service';
import { I18nService } from '../../common/services/i18n.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public email: string = '';
  public errorMessages:string[] = [];

  constructor(private forgotPasswordService: ForgotPasswordService, private i18nService: I18nService) { }

  ngOnInit() {}

  retrivePassword() {
    this.forgotPasswordService.retrivePassword(this.email).then(
      data => {
        /** @todo */
        console.log(data);
      },
      err => {
          let namespace = "forgot-password";

          this.i18nService.doTranslateList(namespace, err).then( res => {
            this.errorMessages = res; // errorMessages is a list of error strings
          });
      }
    );
  }

}
