import { Injectable } from '@angular/core';
import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';
import { ErrorLogService } from '../error-log.service';

@Injectable()
export class ProtocolAbstract {
  protected web3;
  protected contract;
  protected abi;
  protected gas = 10000000;

  constructor(
    protected web3Service: Web3Service,
    private walletService: WalletService,
    public errorLogService: ErrorLogService) {}

  protected getWallet() {
    return this.walletService.getWallet();
  }

  protected getAddressFromBuild(build: any) {
    const buildKeys = Object.keys(build.networks);
    return build.networks[buildKeys[buildKeys.length - 1]].address;
  }

  public getContract(address) {
    if (!this.contract) {
      const web3 = this.web3Service.getInstance();
      this.contract = new web3.eth.Contract(this.abi, address);
    }
    return this.contract;
  }

  public getConstants(address, constantNames: string[]) {
    const contract = this.getContract(address);
    const promises = [];
    const contractObj = {};
    constantNames.forEach(constant => {
      promises.push(contract.methods[constant]().call().then(value => {
        contractObj[constant] = value;
      }));
    })

    return Promise.all(promises).then(resolved => contractObj);
  }

  public signAndSendTransaction(encoded: string, address: string, value?: number, success?: Function, error?: Function) {
    const web3 = this.web3Service.getInstance();
    return web3.eth.net.getId().then(chainId => {
      return web3.eth.getTransactionCount(this.getWallet().address).then(nonce => {
        const tx = {
          from: this.getWallet().address,
          to: address,
          nonce: nonce,
          chainId: chainId,
          data: encoded,
        } as any;

        //return web3.eth.estimateGas(tx).then(estimatedGas => {
          //const gas = web3.utils.hexToNumber(estimatedGas);
          // tx.gas = Math.round(gas * 1.1);
          //tx.gas = gas;
          tx.gas = this.gas;
          if (value) {
            tx.value = value;
          }
          this.errorLogService.setTXvalue(tx);
          return web3.eth.sendTransaction(tx)
            .on('error', error)
            .on('receipt', success);
        //});
      });
    });

  }

  public getEvents(filterKey, filterValue, eventName, contractAddress, cb) {
    this.getContract(contractAddress).getPastEvents(eventName, {
      fromBlock: 0,
      toBlock: 'latest'
    }, (error, events) => {
      if (filterKey && filterValue) {
        cb(error, events.filter(event => event.returnValues[filterKey] === filterValue));
      } else {
        cb(error, events);
      }
    });
  }
}
