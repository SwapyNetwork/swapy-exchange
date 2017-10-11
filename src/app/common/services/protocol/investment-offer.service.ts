import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';

import { InvestmentOfferInterface as InvestmentOffer } from '../../../../../contracts/InvestmentOffer';
import { addresses } from '../../../../../contracts/address';

@Injectable()
export class InvestmentOfferProtocolService {
  private web3;
  private wallet;
  private contract;

  constructor(private web3Service: Web3Service, private walletService: WalletService) {
    this.web3 = this.web3Service.getInstance();
    this.wallet = this.walletService.getWallet();
  }

  private instantiateContract() {
    if (!this.contract) {
      this.contract = new this.web3.eth.Contract(InvestmentOffer.abi);
    }
  }

  public createOffer(id: string, payback: number, grossReturn: number, assets: number[]) {
    this.instantiateContract();
    const encoded = this.contract.methods.createOffer(id, payback, grossReturn * 10000, assets).encodeABI();
    this.signAndSendTransaction(encoded);
  }

  public signAndSendTransaction(encoded: string) {
    const tx = {
      from: this.wallet.address,
      to: addresses.swapyExchange,
      nonce: this.web3.eth.getTransactionCount(this.wallet.address),
      chainId: this.web3.eth.net.getId(),
      data: encoded,
      gas: 200000000
    };

    this.web3.eth.accounts.signTransaction(tx, this.wallet.privateKey).then((signed) => {
      this.web3.eth.sendSignedTransaction(signed.rawTransaction)
        .on('receipt', console.log);
    });
  }
}
