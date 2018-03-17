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
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { ConfirmPurchaseComponent } from './confirm-purchase/confirm-purchase.component';
import { SellAssetComponent } from './sell-asset/sell-asset.component';
import { ConfirmSaleComponent } from './confirm-sale/confirm-sale.component';
import { AddFundsComponent } from './add-funds/add-funds.component';
import { AddFundsChildComponent } from './add-funds/add-funds-child/add-funds-child.component';
import { StartInvestingComponent } from './start-investing/start-investing.component';
import { CancelAssetComponent } from './cancel-asset/cancel-asset.component';

const routes: Routes = [
  {
    path: '',
    component: InvestorComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'start-investing', component: StartInvestingComponent },
      { path: 'add-funds', component: AddFundsComponent },
      { path: 'add-funds/child', component: AddFundsChildComponent },
      { path: 'offer/:id', component: OfferDetailsComponent },
      { path: 'credit-company/:id', component: CreditCompanyComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'terms-of-service', component: TermsPageComponent },
      { path: 'privacy-policy', component: PrivacyPageComponent },
      { path: 'invest', component: InvestComponent },
      { path: 'invest/success', component: SuccessfulInvestmentComponent },
      { path: 'marketplace', component: MarketplaceComponent },
      { path: 'marketplace/confirm-purchase', component: ConfirmPurchaseComponent },
      { path: 'sell', component: SellAssetComponent },
      { path: 'sell/confirm-sale', component: ConfirmSaleComponent },
      { path: 'cancel-asset', component: CancelAssetComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestorRoutingModule { }
