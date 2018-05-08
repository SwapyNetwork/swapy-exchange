import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { NavService } from './nav.service';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

import { NavRoutingModule } from './nav-routing.module';

@NgModule({
  declarations: [NavComponent, TermsOfServiceComponent, PrivacyPolicyComponent],
  imports: [CommonModule, NavRoutingModule],
  exports: [NavComponent, TermsOfServiceComponent, PrivacyPolicyComponent],
  providers: [NavService]
})
export class NavModule {}
