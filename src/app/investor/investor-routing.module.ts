import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestorComponent } from './investor.component';
import { OffersComponent } from './offers/offers.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreditCompanyComponent } from './credit-company/credit-company.component';
import { TermsPageComponent } from './terms-page/terms-page.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { InvestComponent } from './invest/invest.component';
import { SuccessfulInvestmentComponent } from './successful-investment/successful-investment.component';

const routes: Routes = [
  {
    path: '',
    component: InvestorComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'offer/:id', component: OfferDetailsComponent },
      { path: 'credit-company/:id', component: CreditCompanyComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'terms-of-service', component: TermsPageComponent },
      { path: 'privacy-policy', component: PrivacyPageComponent },
      { path: 'invest', component: InvestComponent },
      { path: 'invest/success', component: SuccessfulInvestmentComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestorRoutingModule { }
