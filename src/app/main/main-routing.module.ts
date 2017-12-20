import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';
import { SelectLoginComponent } from './select-login/select-login.component';
import { LoginComponent } from './login/login.component';
import { UportLoginComponent } from './uport-login/uport-login.component';
import { TermsPageComponent } from './terms-page/terms-page.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: SelectLoginComponent },
      { path: 'uport', component: UportLoginComponent },
      { path: 'metamask', component: LoginComponent },
      { path: 'terms-of-service', component: TermsPageComponent },
      { path: 'privacy-policy', component: PrivacyPageComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
