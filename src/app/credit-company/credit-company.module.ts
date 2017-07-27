import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { CreditCompanyRoutingModule } from './credit-company-routing.module';
import { CreditCompanyComponent } from './credit-company.component';
import { NavModule } from '../common/nav/nav.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoutService } from '../common/services/logout.service';
import { AddOfferComponent } from './add-offer/add-offer.component';

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
  declarations: [CreditCompanyComponent, DashboardComponent, AddOfferComponent],
  providers: [LogoutService],
  bootstrap: [CreditCompanyComponent]
})
export class CreditCompanyModule { }
