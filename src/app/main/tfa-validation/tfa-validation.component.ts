import { Component, OnInit } from '@angular/core';
import { TfaService } from '../tfa-setup/tfa.service';

@Component({
  selector: 'app-tfa-validation',
  templateUrl: './tfa-validation.component.html',
  styleUrls: ['./tfa-validation.component.css']
})
export class TfaValidationComponent implements OnInit {
  public otp: number;

  constructor(private tfaService: TfaService) { }

  ngOnInit() {
  }

  validateOtp() {
    this.tfaService.postOtp(this.otp).then(res => console.log(res), err => console.log(err));
  }
}
