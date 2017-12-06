import { Injectable } from '@angular/core';
import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';
import { ErrorLogService } from '../error-log.service';

import * as SwapyExchange from '../../../../contracts/SwapyExchange.json';
import * as AssetLibrary from '../../../../contracts/AssetLibrary.json';
import * as InvestmentAsset from '../../../../contracts/InvestmentAsset.json';

@Injectable()
export class SwapyProtocol {
  protected web3;
  protected contract;
  protected abi;
  protected gasPrice = 1;

  private SwapyExchangeContract;
  private AssetLibraryContract;
  private InvestmentAssetContract;

  constructor(protected web3Service: Web3Service, protected walletService: WalletService, public errorLogService: ErrorLogService) {
    const web3 = this.web3Service.getInstance();
    this.SwapyExchangeContract = new web3.eth.Contract((SwapyExchange as any).abi, this.getAddressFromBuild(SwapyExchange));
    this.AssetLibraryContract = new web3.eth.Contract((AssetLibrary as any).abi);
    this.InvestmentAssetContract = new web3.eth.Contract((InvestmentAsset as any).abi);
  }

  private getAddressFromBuild(build: any) {
    const buildKeys = Object.keys(build.networks);
    return build.networks[buildKeys[buildKeys.length - 1]].address;
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

    return Promise.all(promises).then(resolved => (contractObj as any));
  }

  public signAndSendTransaction(encoded: string, address: string, value?: number, success?: Function, error?: Function) {
    const web3 = this.web3Service.getInstance();
    return web3.eth.net.getId().then(chainId => {
      return web3.eth.getTransactionCount(this.getWallet().address).then(nonce => {
        const tx = {
          from: this.getWallet().address,
          to: address,
          nonce,
          chainId,
          data: encoded,
          gasPrice: web3.utils.toWei(this.gasPrice, 'gwei')
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

  public async createOffer() {
    this.SwapyExchangeContract
  }

  public async invest() {}
  public async withdrawFunds() {}
  public async refuseInvestment() {}
  public async returnInvestment() {}
  public async cancelInvestment() {}
}
