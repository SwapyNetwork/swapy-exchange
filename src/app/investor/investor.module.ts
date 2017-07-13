import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';

import { InvestorRoutingModule } from './investor-routing.module';
import { InvestorComponent } from './investor.component';
import { OffersComponent } from './offers/offers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerificationPhoneComponent } from './verification-phone/verification-phone.component';
import { VerificationMainComponent } from './verification-main/verification-main.component';
import { VerificationIdentityComponent } from './verification-identity/verification-identity.component';
import { VerificationAddressComponent } from './verification-address/verification-address.component';
import { NavComponent } from '../common/nav/nav.component';
import { OfferComponent } from './offers/offer/offer.component';

@NgModule({
  imports: [
    CommonModule,
    InvestorRoutingModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [InvestorComponent, OffersComponent, DashboardComponent, VerificationPhoneComponent, VerificationMainComponent, VerificationIdentityComponent, VerificationAddressComponent, NavComponent, OfferComponent],
  providers: [],
  bootstrap: [InvestorComponent]
})
export class InvestorModule { }
