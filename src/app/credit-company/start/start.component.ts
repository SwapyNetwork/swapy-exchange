import { Router } from '@angular/router';
import { WalletService } from '../../common/services/wallet.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../common/services/storage.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(
    private walletService: WalletService,
    private storageService: StorageService,
    private router: Router
  ) { }

  public async ngOnInit() {
    const ethBalance = await this.walletService.getEthBalance();
    if (Number(ethBalance) === 0) {
      this.router.navigate(['credit-company/add-funds']);
    }
  }

}
