import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../common/services/wallet.service';

@Component({
  selector: 'app-add-funds-child',
  templateUrl: './add-funds-child.component.html',
  styleUrls: ['./add-funds-child.component.css']
})
export class AddFundsChildComponent implements OnInit {

  public address;
  constructor(
    private walletService: WalletService
  ) { }

  async ngOnInit() {
    this.address = await this.walletService.getWallet().address;
  }

}
