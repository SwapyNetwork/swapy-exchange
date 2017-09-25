import { Component, OnInit } from '@angular/core';
import { TfaService } from './tfa.service';

@Component({
  selector: 'app-tfa-setup',
  templateUrl: './tfa-setup.component.html',
  styleUrls: ['./tfa-setup.component.css']
})
export class TfaSetupComponent implements OnInit {
  private qrcode;

  constructor(private tfaService: TfaService) { }

  ngOnInit() {
    this.tfaService.getQrcode().then(
      (data: any) => {
        this.qrcode = data.qrcode;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
