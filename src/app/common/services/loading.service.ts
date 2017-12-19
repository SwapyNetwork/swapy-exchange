import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoadingService {

  // Observable string sources
  private loadingShowedSource = new Subject<string>();
  private loadingHidSource = new Subject<string>();
  private activeRequests = 0;
  // Observable string streams
  loadingShowed$ = this.loadingShowedSource.asObservable();
  loadingHid$ = this.loadingHidSource.asObservable();

  // Service message commands
  show() {
    // if (this.activeRequests === 0) {
    //   this.loadingShowedSource.next();
    // }
    // this.activeRequests++;
  }

  hide() {
    // if (this.activeRequests === 1) {
    //   this.loadingHidSource.next();
    // }
    // this.activeRequests--;
  }
}
