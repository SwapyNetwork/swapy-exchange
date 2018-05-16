import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../common/services/wallet.service';

@Component({
  selector: 'app-start-investing',
  templateUrl: './start-investing.component.html',
  styleUrls: ['./start-investing.component.css']
})
export class StartInvestingComponent implements OnInit {

  constructor(
    private walletService: WalletService,
    private router: Router
  ) { }

  public async ngOnInit() {
    const ethBalance = await this.walletService.getEthBalance();
    if (Number(ethBalance) === 0) {
      this.router.navigate(['/investor/add-funds']);
    }
  }

}
