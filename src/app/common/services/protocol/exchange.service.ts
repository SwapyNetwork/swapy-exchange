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

  public signAndSendTransaction(encoded: string) {
    return super.signAndSendTransaction(encoded, addresses.swapyExchange);
  }

  public getEvents(eventUuid, eventName, contractAddress, cb) {
    contractAddress = contractAddress == null ? addresses.swapyExchange : contractAddress;
    return super.getEvents(eventUuid, eventName, cb, contractAddress);
  }

  public createOffer(id: string, payback: number, grossReturn: number, assets: number[]) {
    const encoded = this.getProtocolContract().methods.createOffer(id, payback, grossReturn * 10000, assets).encodeABI();
    this.signAndSendTransaction(encoded);
  }

}
