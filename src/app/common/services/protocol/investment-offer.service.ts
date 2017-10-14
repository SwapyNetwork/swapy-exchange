import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';

import { InvestmentOfferInterface as InvestmentOffer } from '../../../../../contracts/InvestmentOffer';
import { addresses } from '../../../../../contracts/address';
import { ExchangeProtocolService } from './exchange.service';

@Injectable()
export class InvestmentOfferProtocolService extends ExchangeProtocolService {

  public createOffer(id: string, payback: number, grossReturn: number, assets: number[]) {
    const encoded = this.getContract().methods.createOffer(id, payback, grossReturn * 10000, assets).encodeABI();
    this.signAndSendTransaction(encoded);
  }

}
