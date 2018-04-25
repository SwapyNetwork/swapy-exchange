import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StorageService } from './common/services/storage.service';
import { HttpService } from './common/services/http.service';
import { I18nService } from './common/services/i18n.service';
import { LoadingService } from './common/services/loading.service';
import { LinkService } from './common/services/link.service';
import { Web3Service } from './common/services/web3.service';
import { WalletService } from './common/services/wallet.service';
import { SwapyProtocolService } from './common/services/swapy-protocol.service';
import { AssetMathService } from './common/services/asset-math.service';
import { LogoutService } from './common/services/logout.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { ToastOptions } from 'ng2-toastr';
import { ToastrService } from './common/services/toastr.service';
import { CustomToastOption } from './common/CustomToastOption';
import { ErrorLogService } from './common/services/error-log.service';
import { SuccessfulInvestmentService } from './investor/successful-investment/successful-investment.service';
import { MessageService } from './investor/message/message.service';
import { AddFundsComponent } from './common/add-funds/add-funds.component';
import { AddFundsChildComponent } from './common/add-funds/add-funds-child/add-funds-child.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastModule.forRoot()
  ],
  providers: [StorageService, HttpService, I18nService, LoadingService, LinkService, Web3Service,
    WalletService, SwapyProtocolService, LogoutService, SuccessfulInvestmentService, MessageService,
    ToastrService, ErrorLogService, AssetMathService, { provide: ToastOptions, useClass: CustomToastOption }],
  bootstrap: [AppComponent]
})
export class AppModule { }
