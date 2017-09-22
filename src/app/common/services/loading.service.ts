import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoadingService {

  // Observable string sources
  private loadingShowedSource = new Subject<string>();
  private loadingHidSource = new Subject<string>();

  // Observable string streams
  loadingShowed$ = this.loadingShowedSource.asObservable();
  loadingHid$ = this.loadingHidSource.asObservable();

  // Service message commands
  show() {
    this.loadingShowedSource.next();
  }

  hide() {
    this.loadingHidSource.next();
  }
}
