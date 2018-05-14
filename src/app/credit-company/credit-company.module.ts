import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { CreditCompanyRoutingModule } from './credit-company-routing.module';
import { NavModule } from '../common/nav/nav.module';
import { FooterModule } from '../common/footer/footer.module';
import { AddFundsModule } from '../common/add-funds/add-funds.module';
import { MessageModule } from '../common/message/message.module';
import { MessageService } from '../common/message/message.service';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { CreditCompanyComponent } from './credit-company.component';

import { LogoutService } from '../common/services/logout.service';
import { AddOfferService } from './add-offer/add-offer.service';
import { ConfirmOfferComponent } from './confirm-offer/confirm-offer.component';
import { ProfileComponent } from './profile/profile.component';

import { TermsPageComponent } from './terms-page/terms-page.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { OfferComponent } from './dashboard/offer/offer.component';
import { DashboardService } from './dashboard/dashboard.service';
import { StartComponent } from './start/start.component';
import { ApproveInvestmentComponent } from './approve-investment/approve-investment.component';
import { ReturnInvestmentComponent } from './return-investment/return-investment.component';
import { RefuseInvestmentComponent } from './refuse-investment/refuse-investment.component';
import { AddCollateralComponent } from './add-collateral/add-collateral.component';

@NgModule({
  imports: [
    CommonModule,
    CreditCompanyRoutingModule,
    HttpModule,
    JsonpModule,
    NavModule,
    FooterModule,
    AddFundsModule,
    MessageModule,
    FormsModule,
    TextMaskModule
  ],
  declarations: [CreditCompanyComponent, DashboardComponent, AddOfferComponent, ConfirmOfferComponent,
    ProfileComponent, TermsPageComponent, PrivacyPageComponent,
    OfferComponent, StartComponent, ApproveInvestmentComponent, ReturnInvestmentComponent,
    RefuseInvestmentComponent, AddCollateralComponent],
  providers: [LogoutService, AddOfferService, DashboardService],
  bootstrap: [CreditCompanyComponent]
})
export class CreditCompanyModule {}
