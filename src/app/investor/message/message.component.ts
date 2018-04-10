import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { WalletService } from '../../common/services/wallet.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  public walletAddress: string;

  public investment;

  constructor(
    private messageService: MessageService,
    private walletService: WalletService) { }

  ngOnInit() {
    this.investment = this.messageService.getCachedInvestment();
    this.walletAddress = this.walletService.getWallet().address;
    this.messageService.cleanMessages();
  }

}
