import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { CreditCompanyRoutingModule } from './credit-company-routing.module';
import { NavModule } from '../common/nav/nav.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { CreditCompanyComponent } from './credit-company.component';

import { LogoutService } from '../common/services/logout.service';
import { AddOfferService } from './add-offer/add-offer.service';
import { OfferService } from './dashboard/offer/offer.service';
import { ConfirmOfferComponent } from './confirm-offer/confirm-offer.component';
import { SuccessfulOfferComponent } from './successful-offer/successful-offer.component';
import { ProfileComponent } from './profile/profile.component';

import { TermsPageComponent } from './terms-page/terms-page.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { OfferComponent } from './dashboard/offer/offer.component';

@NgModule({
  imports: [
    CommonModule,
    CreditCompanyRoutingModule,
    HttpModule,
    JsonpModule,
    NavModule,
    FormsModule,
    TextMaskModule
  ],
  declarations: [CreditCompanyComponent, DashboardComponent, AddOfferComponent, ConfirmOfferComponent, SuccessfulOfferComponent, ProfileComponent, TermsPageComponent, PrivacyPageComponent, OfferComponent],
  providers: [LogoutService, AddOfferService, OfferService],
  bootstrap: [CreditCompanyComponent]
})
export class CreditCompanyModule { }
