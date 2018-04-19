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
    if (message.toLowerCase().indexOf('user denied transaction signature') !== - 1) {
      message = 'User denied transaction signature';
    } else if (sha1(message) === '699e7c6d81ba58075ee84cf2a640c18a409efcba') {
      message = 'Transaction is still being mined. Check it out later to see if the transaction was mined';
    }
    this.getInstance().error(message);
  }


}
