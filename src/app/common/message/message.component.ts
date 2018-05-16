import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { MessageService } from './message.service';
import { WalletService } from '../../common/services/wallet.service';
import { INVESTOR, CREDIT_COMPANY } from '../interfaces/user-type.interface';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  public userType;
  public walletAddress: string;
  public investment;

  public INVESTOR = INVESTOR;
  public CREDIT_COMPANY = CREDIT_COMPANY;

  constructor(
    private storageService: StorageService,
    private messageService: MessageService,
    private walletService: WalletService
  ) { }

  ngOnInit() {
    this.investment = this.messageService.getCachedInvestment();
    this.walletAddress = this.walletService.getWallet().address;
    this.userType = this.storageService.getItem('user').type;
    this.messageService.cleanMessages();
  }

}
