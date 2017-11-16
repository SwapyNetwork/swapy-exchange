import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';

import * as InvestmentOffer from '../../../../contracts/InvestmentOffer.json';

@Injectable()
export class InvestmentOfferProtocolService {

  protected abi = (InvestmentOffer as any).abi;

}
