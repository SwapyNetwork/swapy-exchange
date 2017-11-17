import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';
import { ProtocolAbstract } from './protocol.abstract';
import * as SwapyExchange from '../../../../contracts/SwapyExchange.json';

@Injectable()
export class ExchangeProtocolService extends ProtocolAbstract {
  protected abi = (SwapyExchange as any).abi;
  protected address = super.getAddressFromBuild(SwapyExchange);

  public getProtocolContract() {
    return super.getContract(this.address);
  }

  public signAndSend(encoded: string, success?: Function, error?: Function) {
    return super.signAndSendTransaction(encoded, this.address, null, success, error);
  }

  public getEvents(eventUuid, eventName, cb) {
    this.errorLogService.setParamValues([eventUuid, eventName, this.address, cb]);
    return super.getEvents(eventUuid, eventName, this.address, cb);
  }

  public createOffer(id: string, payback: number, grossReturn: number, currency: string,
    fixedValue: number, offerTermsHash: string, assets: number[], success?: Function, error?: Function) {
      this.errorLogService.setParamValues([id, payback, grossReturn * 10000, currency, fixedValue * 100,
        this.web3Service.getInstance().utils.asciiToHex(offerTermsHash), assets]);
      const encoded = this.getProtocolContract().methods
        .createOffer(
          id,
          payback,
          grossReturn * 10000,
          currency,
          this.web3Service.getInstance().utils.asciiToHex(offerTermsHash),
          assets)
        .encodeABI();
      this.signAndSend(encoded, success, error);
  }
}
