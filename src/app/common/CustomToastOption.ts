import { ToastOptions } from 'ng2-toastr';

export class CustomToastOption extends ToastOptions {
  animate = 'flyRight';
  positionClass = 'toast-bottom-left';
  showCloseButton = true;
}
