import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditCompanyComponent } from './credit-company.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { ConfirmOfferComponent } from './confirm-offer/confirm-offer.component';
import { SuccessfulOfferComponent } from './successful-offer/successful-offer.component';

const routes: Routes = [
	{
		path: '',
		component: CreditCompanyComponent,
		children: [
			{ path: '', component: DashboardComponent },
			{ path: 'raise', component: AddOfferComponent },
			{ path: 'raise/confirm', component: ConfirmOfferComponent },
			{ path: 'raise/success', component: SuccessfulOfferComponent },
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditCompanyRoutingModule { }
