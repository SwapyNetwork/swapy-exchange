import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';

import { SwapyExchangeInterface as SwapyExchange } from '../../../../../contracts/SwapyExchange';
import { addresses } from '../../../../../contracts/address';

@Injectable()
export class ExchangeProtocolService {
  private web3;
  private wallet;
  private contract;

  constructor(private web3Service: Web3Service, private walletService: WalletService) {
    this.web3 = this.web3Service.getInstance();
  }

  protected getWallet() {
    if (!this.wallet) {
      this.wallet = this.walletService.getWallet();
    }
    return this.wallet;
  }

  public getContract() {
    if (!this.contract) {
      this.contract = new this.web3.eth.Contract(SwapyExchange.abi, addresses.swapyExchange);
    }
    return this.contract;
  }

  public signAndSendTransaction(encoded: string) {
    const tx = {
      from: this.getWallet().address,
      to: addresses.swapyExchange,
      nonce: this.web3.eth.getTransactionCount(this.wallet.address),
      chainId: this.web3.eth.net.getId(),
      data: encoded,
      gas: 5000000
    };

    this.web3.eth.accounts.signTransaction(tx, this.wallet.privateKey).then((signed) => {
      this.web3.eth.sendSignedTransaction(signed.rawTransaction)
        .on('receipt', console.log);
    });
  }

  public getEvents(eventUuid, cb) {
    this.getContract().getPastEvents('Offers', {
      fromBlock: 0,
      toBlock: 'latest'
    }, (error, events) => { cb(error, events.filter(event => event.returnValues._id === eventUuid)) });
  }
}
