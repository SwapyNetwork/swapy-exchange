import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';

import { CreditCompanyRoutingModule } from './credit-company-routing.module';
import { CreditCompanyComponent } from './credit-company.component';
import { NavModule } from '../common/nav/nav.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {LogoutService} from '../common/services/logout.service';

@NgModule({
  imports: [
    CommonModule,
    CreditCompanyRoutingModule,
    HttpModule,
    JsonpModule,
    NavModule
  ],
  declarations: [CreditCompanyComponent, DashboardComponent],
  providers: [LogoutService],
  bootstrap: [CreditCompanyComponent]
})
export class CreditCompanyModule { }
