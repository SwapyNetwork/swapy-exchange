import { Injectable } from '@angular/core';
import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';

@Injectable()
export class ProtocolAbstract {
  protected web3;
  protected wallet;
  protected contract;
  protected abi;
  protected gas = 5000000;

  constructor(protected web3Service: Web3Service, private walletService: WalletService) {
    this.web3 = this.web3Service.getInstance();
  }

  protected getWallet() {
    if (!this.wallet) {
      this.wallet = this.walletService.getWallet();
    }
    return this.wallet;
  }

  public getContract(address) {
    if (!this.contract) {
      this.contract = new this.web3.eth.Contract(this.abi, address);
    }
    return this.contract;
  }

  public signAndSendTransaction(encoded: string, address: string) {
    const tx = {
      from: this.getWallet().address,
      to: address,
      nonce: this.web3.eth.getTransactionCount(this.wallet.address),
      chainId: this.web3.eth.net.getId(),
      data: encoded,
      gas: this.gas
    };

    this.web3.eth.accounts.signTransaction(tx, this.wallet.privateKey).then((signed) => {
      this.web3.eth.sendSignedTransaction(signed.rawTransaction)
        .on('receipt', console.log);
    });
  }

  public getEvents(eventUuid, cb, contractAddress) {
    this.getContract(contractAddress).getPastEvents('Offers', {
      fromBlock: 0,
      toBlock: 'latest'
    }, (error, events) => { cb(error, events.filter(event => event.returnValues._id === eventUuid)) });
  }
}
