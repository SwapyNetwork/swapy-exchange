import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFundsComponent } from './add-funds.component';
import { AddFundsChildComponent } from './add-funds-child/add-funds-child.component';

import { AddFundsRoutingModule } from './add-funds-routing.module';

@NgModule({
  imports: [CommonModule, AddFundsRoutingModule],
  declarations: [AddFundsComponent, AddFundsChildComponent],
  exports: [AddFundsComponent, AddFundsChildComponent]
})
export class AddFundsModule { }
