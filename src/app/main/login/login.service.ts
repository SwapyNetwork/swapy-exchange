import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '../../common/services/storage.service';
import { LoadingService } from '../../common/services/loading.service';

@Injectable()
export class LoginService {

  constructor(public storageService: StorageService, private router: Router,
    public loadingService: LoadingService) {}

  verifyLogin() {
    if (!this.storageService.getItem('acceptedTerms')) {
      this.router.navigate(['/']);
    }
  }
}
