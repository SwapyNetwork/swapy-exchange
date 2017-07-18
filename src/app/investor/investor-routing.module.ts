import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestorComponent } from './investor.component';
import { OffersComponent } from './offers/offers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerificationMainComponent } from './verification-main/verification-main.component';

const routes: Routes = [
	{
		path: '',
		component: InvestorComponent,
		children: [
			{ path: '', component: DashboardComponent },
			{ path: 'verification', component: VerificationMainComponent },
			{ path: 'offers', component: OffersComponent }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestorRoutingModule { }
