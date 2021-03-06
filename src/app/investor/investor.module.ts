import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { InvestorRoutingModule } from './investor-routing.module';
import { NavModule } from '../common/nav/nav.module';
import { FooterModule } from '../common/footer/footer.module';
import { AddFundsModule } from '../common/add-funds/add-funds.module';
import { MessageModule } from '../common/message/message.module';

import { InvestorComponent } from './investor.component';
import { OffersComponent } from './offers/offers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OfferComponent } from './offers/offer/offer.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { CreditCompanyComponent } from './credit-company/credit-company.component';
import { LogoutService } from '../common/services/logout.service';
import { TermsPageComponent } from './terms-page/terms-page.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { ProfileComponent } from './profile/profile.component';
import { InvestComponent } from './invest/invest.component';

import { OfferService } from './offers/offer.service';
import { InvestService } from './invest/invest.service';
import { InvestmentComponent } from './dashboard/investment/investment.component';
import { DashboardService } from './dashboard/dashboard.service';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { AssetComponent } from './marketplace/asset/asset.component';
import { ConfirmPurchaseComponent } from './confirm-purchase/confirm-purchase.component';
import { MarketplaceService } from './marketplace/marketplace.service';
import { SellAssetComponent } from './sell-asset/sell-asset.component';
import { SellAssetService } from './sell-asset/sell-asset.service';
import { StartInvestingComponent } from './start-investing/start-investing.component';
import { CancelAssetComponent } from './cancel-asset/cancel-asset.component';
import { AcceptSaleComponent } from './accept-sale/accept-sale.component';
import { RequireTokenComponent } from './require-token/require-token.component';
import { MessageService } from '../common/message/message.service';

@NgModule({
  imports: [
    CommonModule,
    InvestorRoutingModule,
    HttpModule,
    JsonpModule,
    NavModule,
    FooterModule,
    AddFundsModule,
    MessageModule,
    FormsModule,
    TextMaskModule
  ],
  declarations: [InvestorComponent, OffersComponent, DashboardComponent, OfferComponent,
    OfferDetailsComponent, CreditCompanyComponent, TermsPageComponent, PrivacyPageComponent, ProfileComponent,
    InvestComponent, InvestmentComponent, MarketplaceComponent, AssetComponent,
    ConfirmPurchaseComponent, SellAssetComponent, StartInvestingComponent, CancelAssetComponent,
    AcceptSaleComponent, RequireTokenComponent],
  providers: [LogoutService, OfferService, InvestService, DashboardService,
    MarketplaceService, SellAssetService],
  bootstrap: [InvestorComponent]
})
export class InvestorModule { }
