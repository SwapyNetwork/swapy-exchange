import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../common/services/wallet.service';
const qrcodeGenerator = require("qrcode-generator");
@Component({
  selector: 'app-add-funds-child',
  templateUrl: './add-funds-child.component.html',
  styleUrls: ['./add-funds-child.component.css']
})
export class AddFundsChildComponent implements OnInit {

  public wallet;
  constructor(
    private walletService: WalletService,
  ) { }

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
