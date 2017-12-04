import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';
import { ProtocolAbstract } from './protocol.abstract';
// import * as FinId from '../../../../contracts/FinId.json';

@Injectable()
export class FinIdProtocolService extends ProtocolAbstract {
  // protected abi = (FinId as any).abi;
  protected address = '0x123';

  public getFinIdContract() {
    return super.getContract(this.address);
  }

  public signAndSend(encoded: string, success?: Function, error?: Function) {
    return super.signAndSendTransaction(encoded, this.address, null, success, error);
  }

  public getEvents(eventUuid, eventName, cb) {
    this.errorLogService.setParamValues([eventUuid, eventName, this.address, cb]);
    return super.getEvents('_id', eventUuid, eventName, this.address, cb);
  }

  public getOffers(cb) {
    this.errorLogService.setParamValues([this.address, cb]);
    return super.getEvents(null, null, 'Offers', this.address, cb);
  }

  public getUser(address) {
    return this.getFinIdContract().methods.getUser(address).call();
  }

  public newUser(success?: Function, error?: Function) {
      const encoded = this.getFinIdContract().methods
        .newUser()
        .encodeABI();
      this.signAndSend(encoded, success, error);
  }
}
