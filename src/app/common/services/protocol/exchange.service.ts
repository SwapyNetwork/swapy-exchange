import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';
import { ProtocolAbstract } from './protocol.abstract';
import { SwapyExchangeInterface as SwapyExchange } from '../../../../../contracts/SwapyExchange';
import { addresses } from '../../../../../contracts/address';

@Injectable()
export class ExchangeProtocolService extends ProtocolAbstract {
  protected abi = SwapyExchange.abi;

  public getProtocolContract() {
    return super.getContract(addresses.swapyExchange);
  }

  public signAndSend(encoded: string, success?: Function, error?: Function) {
    return super.signAndSendTransaction(encoded, addresses.swapyExchange, null, success, error);
  }

  public getEvents(eventUuid, eventName, cb) {
    this.errorLogService.setParamValues([eventUuid, eventName, addresses.swapyExchange, cb]);
    return super.getEvents(eventUuid, eventName, addresses.swapyExchange, cb);
  }

  public createOffer(id: string, payback: number, grossReturn: number, currency: string,
    fixedValue: number, offerTermsHash: string, assets: number[], success?: Function, error?: Function) {
      console.log(fixedValue)
      this.errorLogService.setParamValues([id, payback, grossReturn * 10000, currency, fixedValue, offerTermsHash, assets]);
      const encoded = this.getProtocolContract().methods
        .createOffer(id, payback, grossReturn * 10000, currency, fixedValue * 100,
          offerTermsHash, assets)
        .encodeABI();
      this.signAndSend(encoded, success, error);
  }
}
