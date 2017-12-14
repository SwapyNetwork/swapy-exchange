import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LoginService } from './login/login.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'main-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  title = 'main';

  constructor(private router: Router,  public loginService: LoginService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart && event.url !== '/') {
        this.loginService.verifyLogin();
      }
    });
  }
}
