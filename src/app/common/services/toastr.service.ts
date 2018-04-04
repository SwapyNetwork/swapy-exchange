import { Injectable, ApplicationRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import * as sha1 from 'sha1';

@Injectable()
export class ToastrService {

  constructor(private toastr: ToastsManager, private applicationRef: ApplicationRef) {}

  public getInstance() {
     // Getting viewContainerRef from App Component (so the toaster can appear anywhere)
    const appVCR = this.applicationRef.components[0].instance.viewContainerRef;
    this.toastr.setRootViewContainerRef(appVCR);
    return this.toastr;
  }

  public error(message) {
    if (sha1(message) === '3e12edbb1afb59df817eac17f994436369cd74bc') {
      message = 'Transaction denied by the user';
    }
    this.getInstance().error(message);
  }


}
