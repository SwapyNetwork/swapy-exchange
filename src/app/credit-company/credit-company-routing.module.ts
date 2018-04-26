import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditCompanyComponent } from './credit-company.component';
import { StartComponent } from './start/start.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApproveInvestmentComponent } from './approve-investment/approve-investment.component';
import { ReturnInvestmentComponent } from './return-investment/return-investment.component';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { ConfirmOfferComponent } from './confirm-offer/confirm-offer.component';
import { SuccessfulOfferComponent } from './successful-offer/successful-offer.component';
import { PendingOfferComponent } from './pending-offer/pending-offer.component';
import { TermsPageComponent } from './terms-page/terms-page.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { ProfileComponent } from './profile/profile.component';
import { SupplyTokenComponent } from './supply-token/supply-token.component';
import { AddFundsComponent } from '../common/add-funds/add-funds.component';
import { AddFundsChildComponent } from '../common/add-funds/add-funds-child/add-funds-child.component';

const routes: Routes = [
  {
    path: '',
    component: CreditCompanyComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'start', component: StartComponent },
      { path: 'add-funds', component: AddFundsComponent },
      { path: 'add-funds/child', component: AddFundsChildComponent },
      { path: 'raise', component: AddOfferComponent },
      { path: 'raise/confirm', component: ConfirmOfferComponent },
      { path: 'raise/success', component: SuccessfulOfferComponent },
      { path: 'raise/pending', component: PendingOfferComponent },
      { path: 'approve-investment', component: ApproveInvestmentComponent },
      { path: 'return-investment', component: ReturnInvestmentComponent },
      { path: 'supply-token', component: SupplyTokenComponent },
      { path: 'terms-of-service', component: TermsPageComponent },
      { path: 'privacy-policy', component: PrivacyPageComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditCompanyRoutingModule { }
