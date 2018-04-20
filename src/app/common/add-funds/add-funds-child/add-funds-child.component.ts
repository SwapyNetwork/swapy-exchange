import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../common/services/wallet.service';
import { StorageService } from '../../services/storage.service';
import { INVESTOR, CREDIT_COMPANY } from '../../interfaces/user-type.interface';

const qrcodeGenerator = require('qrcode-generator');
@Component({
  selector: 'app-add-funds-child',
  templateUrl: './add-funds-child.component.html',
  styleUrls: ['./add-funds-child.component.css']
})
export class AddFundsChildComponent implements OnInit {

  public userType;
  public INVESTOR = INVESTOR;
  public CREDIT_COMPANY = CREDIT_COMPANY;

  public wallet;
  constructor(
    private walletService: WalletService,
    private storageService: StorageService,

  ) { 
    this.userType = this.storageService.getItem('user').type;
  }

  async ngOnInit() {
    this.wallet = await this.walletService.getWallet();
    this.getQRUri();
  }

  public getQRUri() {
    const qr = qrcodeGenerator(0, 'H');
    qr.addData(this.wallet.address);
    qr.make();
    document.getElementById('qrcode').innerHTML = qr.createImgTag(5); // NOT PROPER ANGULAR 2
  }

}
