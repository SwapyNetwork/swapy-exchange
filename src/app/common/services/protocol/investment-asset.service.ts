import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';

import { InvestmentAssetInterface as InvestmentAsset } from '../../../../../contracts/InvestmentAsset';
import { addresses } from '../../../../../contracts/address';

@Injectable()
export class InvestmentAssetProtocolService {
  private web3;
  private wallet;
  private contract;

  constructor(private web3Service: Web3Service, private walletService: WalletService) {
    this.web3 = this.web3Service.getInstance();
  }

  private getWallet() {
    if (!this.wallet) {
      this.wallet = this.walletService.getWallet();
    }
    return this.wallet;
  }

  private getContract() {
    if (!this.contract) {
      this.contract = new this.web3.eth.Contract(InvestmentAsset.abi);
    }
    return this.contract;
  }

  public agreeInvestment(id: string, investor: string, agreementTermsHash: string, value: number) {
    const encoded = this.getContract().methods.agreeInvestment(id, investor, agreementTermsHash, value).encodeABI();
    this.signAndSendTransaction(encoded);
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
}
