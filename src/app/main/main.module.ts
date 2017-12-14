import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { TermsPageComponent } from './terms-page/terms-page.component';

import { NavModule } from '../common/nav/nav.module';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    NavModule,
    TextMaskModule
  ],
  declarations: [MainComponent, LoginComponent, PrivacyPageComponent, TermsPageComponent],
  providers: [LoginService],
  bootstrap: [MainComponent]
})
export class MainModule {}
