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

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule
  ],
  declarations: [MainComponent, LoginComponent, SignUpComponent, ForgotPasswordComponent, TfaQuestionComponent, TfaValidationComponent, TfaSetupComponent],
  providers: [],
  bootstrap: [MainComponent]
})
export class MainModule { }
