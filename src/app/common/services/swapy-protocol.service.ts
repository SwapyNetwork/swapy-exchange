import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from './web3.service';
import { WalletService } from './wallet.service';
import { ToastrService } from './toastr.service';
import { ErrorLogService } from './error-log.service';
import { StorageService } from './storage.service';
import { PriceService } from './price.service';
import { ProtocolStrategy } from '../interfaces/protocol.strategy.interface';
import { ProtocolEventsService } from './protocolEvents.service';
import { ProtocolFactory } from './protocol.factory.service';

const env = require('../../../../env.json');

const SwapyExchange = require(`../../../contracts/${(env as any).NETWORK_NAME}/SwapyExchange.json`);
const AssetLibrary = require(`../../../contracts/${(env as any).NETWORK_NAME}/AssetLibrary.json`);
const InvestmentAsset = require(`../../../contracts/${(env as any).NETWORK_NAME}/InvestmentAsset.json`);


@Injectable()
export class SwapyProtocolService {

  constructor(protected walletService: WalletService,
    public errorLogService: ErrorLogService,
    public http: HttpClient,
    public priceService: PriceService,
    public protocolFactory: ProtocolFactory,
    public protocolEvents: ProtocolEventsService) { }

  public get(event: string) {
    return this.protocolEvents.getExchangeEvent(event);
  }

  public getAsset(contractAddress: string) {
    const protocol = this.protocolFactory.getProtocol();
    return protocol.getAsset(contractAddress);
  }

  public getAssetConstants(contractAddress: string, constantNames: string[]) {
    const protocol = this.protocolFactory.getProtocol();
   return protocol.getAssetConstants(contractAddress, constantNames);
  }

  public createOffer(payback: number, grossReturn: number, currency: string, value: number, offerTermsHash: string, assets: number[]) {
    const protocol = this.protocolFactory.getProtocol();
    return protocol.createOffer(payback, grossReturn, currency, value, offerTermsHash, assets);
  }

  public async invest(assetAddress: string[], value: number) {
    const ethValue = await this.priceService.usdToEth(value);
    const protocol = this.protocolFactory.getProtocol();
    return protocol.invest(assetAddress, ethValue);
  }

  public withdrawFunds(contractAddress: string) {
    const protocol = this.protocolFactory.getProtocol();
    return protocol.withdrawFunds(contractAddress);
  }

  public refuseInvestment(contractAddress: string) {
    const protocol = this.protocolFactory.getProtocol();
    return protocol.refuseInvestment(contractAddress);
  }

  public async returnInvestment(contractAddress: string, value: number) {
    const ethValue = await this.priceService.usdToEth(value);
    const protocol = this.protocolFactory.getProtocol();
    return protocol.returnInvestment(contractAddress, ethValue);
  }

  public async cancelInvestment(contractAddress: string) {
    const protocol = this.protocolFactory.getProtocol();
    return protocol.cancelInvestment(contractAddress);
  }

}
