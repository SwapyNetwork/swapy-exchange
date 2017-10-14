import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';

import { InvestmentAssetInterface as InvestmentAsset } from '../../../../../contracts/InvestmentAsset';
import { addresses } from '../../../../../contracts/address';
import { ExchangeProtocolService } from './exchange.service';

@Injectable()
export class InvestmentAssetProtocolService extends ExchangeProtocolService {

  public agreeInvestment(id: string, investor: string, agreementTermsHash: string, value: number) {
    const encoded = this.getContract().methods.agreeInvestment(id, investor, agreementTermsHash, value).encodeABI();
    this.signAndSendTransaction(encoded);
  }

}
