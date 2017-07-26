import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component'

import { NavRoutingModule } from './nav-routing.module';

@NgModule({
	declarations: [NavComponent],
	imports: [CommonModule, NavRoutingModule],
	exports: [NavComponent]
})
export class NavModule {}