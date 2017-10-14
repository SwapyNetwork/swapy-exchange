import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../common/services/wallet.service';

@Component({
  selector: 'app-pending-offer',
  templateUrl: './pending-offer.component.html',
  styleUrls: ['./pending-offer.component.css']
})
export class PendingOfferComponent implements OnInit {

  public walletAddress;

  constructor(private walletService: WalletService, private router: Router) { }

  ngOnInit() {
    this.walletAddress = this.walletService.getWallet().address;
  }

}
