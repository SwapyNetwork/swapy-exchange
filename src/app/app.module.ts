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
import { Web3Service } from './common/services/web3.service';
import { WalletService } from './common/services/wallet.service';
import { NgxElectronModule } from 'ngx-electron';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxElectronModule,
  ],
  providers: [StorageService, HttpService, I18nService, LoadingService, Web3Service, WalletService],
  bootstrap: [AppComponent]
})
export class AppModule { }
