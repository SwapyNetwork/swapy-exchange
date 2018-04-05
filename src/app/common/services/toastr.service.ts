import { Injectable, ApplicationRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
    }
    this.getInstance().error(message);
  }


}
