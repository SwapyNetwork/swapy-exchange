import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TfaQuestionComponent } from './tfa-question/tfa-question.component';
import { TfaValidationComponent } from './tfa-validation/tfa-validation.component';
import { TfaSetupComponent } from './tfa-setup/tfa-setup.component';
import { LoginService } from './login/login.service';
import { SignUpService } from './sign-up/sign-up.service';
import { TfaService } from './tfa-setup/tfa.service';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { TermsPageComponent } from './terms-page/terms-page.component';

import { NavModule } from '../common/nav/nav.module';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    NavModule
  ],
  declarations: [MainComponent, LoginComponent, SignUpComponent, ForgotPasswordComponent, TfaQuestionComponent, TfaValidationComponent, TfaSetupComponent, PrivacyPageComponent, TermsPageComponent],
  providers: [LoginService, SignUpService, ForgotPasswordService, TfaService],
  bootstrap: [MainComponent]
})
export class MainModule { }
