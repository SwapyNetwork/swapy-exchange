import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { InvestorRoutingModule } from './investor-routing.module';
import { InvestorComponent } from './investor.component';
import { OffersComponent } from './offers/offers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerificationPhoneComponent } from './verification-phone/verification-phone.component';
import { VerificationMainComponent } from './verification-main/verification-main.component';
import { VerificationIdentityComponent } from './verification-identity/verification-identity.component';
import { VerificationAddressComponent } from './verification-address/verification-address.component';
import { NavModule } from '../common/nav/nav.module';
import { OfferComponent } from './offers/offer/offer.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { CreditCompanyComponent } from './credit-company/credit-company.component';
import { LogoutService } from '../common/services/logout.service';
import { TermsPageComponent } from './terms-page/terms-page.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { ProfileComponent } from './profile/profile.component';

import { OfferService } from './offers/offer.service';
import { InvestComponent } from './invest/invest.component';

@NgModule({
  imports: [
    CommonModule,
    InvestorRoutingModule,
    HttpModule,
    JsonpModule,
    NavModule,
    FormsModule,
    TextMaskModule
  ],
  declarations: [InvestorComponent, OffersComponent, DashboardComponent, VerificationPhoneComponent, VerificationMainComponent, VerificationIdentityComponent, VerificationAddressComponent, OfferComponent, OfferDetailsComponent, CreditCompanyComponent, TermsPageComponent, PrivacyPageComponent, ProfileComponent, InvestComponent],
  providers: [LogoutService, OfferService],
  bootstrap: [InvestorComponent]
})
export class InvestorModule { }
