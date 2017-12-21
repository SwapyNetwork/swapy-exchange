import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../common/services/wallet.service';
import { StorageService } from '../../common/services/storage.service';
import { PendingOfferService } from './pending-offer.service';

@Component({
  selector: 'app-pending-offer',
  templateUrl: './pending-offer.component.html',
  styleUrls: ['./pending-offer.component.css']
})
export class PendingOfferComponent implements OnInit {

  public walletAddress;
  public message: string;

  constructor(private walletService: WalletService, private router: Router,
    public pendingOfferService: PendingOfferService, private storageService: StorageService) {}

  ngOnInit() {
    let message: string = null;
    if (this.storageService.getItem('uPort')) {
      message = 'Please confirm the transaction card in your uPort mobile app'
    }
    this.pendingOfferService.setMessage(message);
    this.walletAddress = this.walletService.getWallet().address;
  }

}
