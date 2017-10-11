import { Injectable } from '@angular/core';

import { Web3Service } from './web3.service';
import { WalletService } from './wallet.service';

import { SwapyExchangeInterface as SwapyExchange } from '../../../../contracts/SwapyExchange';
import { addresses } from '../../../../contracts/address';

@Injectable()
export class ProtocolService {
  private web3;
  private wallet;
  private contract;

  constructor(private web3Service: Web3Service, private walletService: WalletService) {
    this.web3 = this.web3Service.getInstance();
    // this.wallet = this.walletService.getWallet();
  }

  private instantiateContract() {
    if (!this.contract) {
      this.contract = new this.web3.eth.Contract(SwapyExchange.abi, addresses.swapyExchange);
    }
  }

  public createOffer(payback: number, grossReturn: number) {
    this.instantiateContract();
    const encoded = this.contract.methods.createOffer(payback, grossReturn * 10000).encodeABI();
    this.signAndSendTransaction(encoded);
  }

  public signAndSendTransaction(encoded: string) {
    const tx = {
      from: this.wallet.address,
      to: addresses.swapyExchange,
      nonce: this.web3.eth.getTransactionCount(this.wallet.address),
      chainId: this.web3.eth.net.getId(),
      data: encoded,
      gas: 2000000
    };

    this.web3.eth.accounts.signTransaction(tx, this.wallet.privateKey).then((signed) => {
      this.web3.eth.sendSignedTransaction(signed.rawTransaction)
        .on('receipt', console.log);
    });
  }
}
