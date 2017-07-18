import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { MainModule } from './main/main.module';

const routes: Routes = [
    { path: '', loadChildren: 'app/main/main.module.ts#MainModule' },
    { path: 'investor', loadChildren: 'app/investor/investor.module.ts#InvestorModule' },
    { path: 'credit-company', loadChildren: 'app/credit-company/credit-company.module.ts#CreditCompanyModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
