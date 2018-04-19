import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Offer } from '../../common/interfaces/offer.interface';
import { OfferService } from './offer.service';
import { Web3Service } from '../../common/services/web3.service';
import { LoadingService } from '../../common/services/loading.service';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  public offers: Offer[] = [];
  public errorMessage;
  public web3;
  mode = 'Observable';

  constructor(
    public offerService: OfferService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private swapyProtocol: SwapyProtocol
  ) { }

  ngOnInit() {
    this.web3 = this.web3Service.getInstance();
    this.getOffersFromBlockchain();
  }

  public async getOffersFromBlockchain() {
    this.loadingService.show();
    this.offers = await this.offerService.getOffersFromBlockchain();
    this.loadingService.hide();
  }
}
