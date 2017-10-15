import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';

import { InvestmentOfferInterface as InvestmentOffer } from '../../../../../contracts/InvestmentOffer';
import { addresses } from '../../../../../contracts/address';

@Injectable()
export class InvestmentOfferProtocolService {

  protected abi = InvestmentOffer.abi;

}
