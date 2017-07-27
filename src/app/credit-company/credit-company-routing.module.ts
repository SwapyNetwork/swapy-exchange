import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditCompanyComponent } from './credit-company.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddOfferComponent } from './add-offer/add-offer.component';

const routes: Routes = [
	{
		path: '',
		component: CreditCompanyComponent,
		children: [
			{ path: '', component: DashboardComponent },
			{ path: 'raise', component: AddOfferComponent }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditCompanyRoutingModule { }
