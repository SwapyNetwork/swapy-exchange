import { Component } from '@angular/core';
import { LoadingService } from './common/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  loading = false;

  constructor(public loadingService: LoadingService){
    this.loadingService.loadingShowed$.subscribe(
      showed => {console.log("show");this.loading = true}
    );

    this.loadingService.loadingHid$.subscribe(
      hid => {console.log("hide");this.loading = false}
    );
  }

  showLoading() {
    this.loading = true;
  }

  hideLoading() {
    this.loading = false;
  }

}
