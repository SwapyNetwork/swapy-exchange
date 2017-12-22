import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

const env = require('../../../../env.json');

const SwapyExchange = require(`../../../contracts/${(env as any).NETWORK_NAME}/SwapyExchange.json`);
const AssetLibrary = require(`../../../contracts/${(env as any).NETWORK_NAME}/AssetLibrary.json`);
const InvestmentAsset = require(`../../../contracts/${(env as any).NETWORK_NAME}/InvestmentAsset.json`);


@Injectable()
export class ProtocolEventsService {
  protected web3;

  private SwapyExchangeContract;
  private AssetLibraryContract;
  private InvestmentAssetContract;

  constructor(protected web3Service: Web3Service) {
    this.web3 = this.web3Service.getInstance();
    this.SwapyExchangeContract = new this.web3.eth.Contract((SwapyExchange as any).abi, this.getAddressFromBuild(SwapyExchange));
    this.AssetLibraryContract = new this.web3.eth.Contract((AssetLibrary as any).abi);
    this.InvestmentAssetContract = new this.web3.eth.Contract((InvestmentAsset as any).abi);
  }

  private getAddressFromBuild(build: any) {
    let networkId;
    const networkIds = Object.keys(build.networks);
    (env as any).NETWORK_ID ? networkId = (env as any).NETWORK_ID : networkId = networkIds[networkIds.length - 1];
    return build.networks[networkId].address;
  }

  public getExchangeEvent(event: string) {
    return this.SwapyExchangeContract.getPastEvents(event, {
      fromBlock: 0,
      toBlock: 'latest'
    });
  }
}
