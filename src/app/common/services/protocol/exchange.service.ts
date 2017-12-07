import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';
import { ProtocolAbstract } from './protocol.abstract';
import * as SwapyExchange from '../../../../contracts/SwapyExchange.json';

@Injectable()
export class ExchangeProtocolService extends ProtocolAbstract {
  protected abi = (SwapyExchange as any).abi;
  protected address = super.getAddressFromBuild(SwapyExchange);

  public getProtocolContract() {
    return super.getContract(this.address);
  }

  public signAndSend(encoded: string, success?: Function, error?: Function) {
    return super.signAndSendTransaction(encoded, this.address, null, success, error);
  }

  public getEvents(eventUuid, eventName, cb) {
    this.errorLogService.setParamValues([eventUuid, eventName, this.address, cb]);
    return super.getEvents('_id', eventUuid, eventName, this.address, cb);
  }

  public getOffers(cb) {
    this.errorLogService.setParamValues([this.address, cb]);
    return super.getEvents(null, null, 'Offers', this.address, cb);
  }

  public getMyOffers(companyAddress, cb) {
    this.errorLogService.setParamValues([this.address, cb]);
    return super.getEvents(null, null, 'Offers', this.address, (err, offers) => {
      cb(err, offers.filter(offer => offer.returnValues._from.toLowerCase() === companyAddress.toLowerCase()));
    });
  }

  public getMyInvestments(investorAddress, cb) {
    this.errorLogService.setParamValues([this.address, cb]);
    return super.getEvents(null, null, 'Investments', this.address, (err, investments) => {
      cb(err, investments.filter(investment => investment.returnValues._investor.toLowerCase() === investorAddress.toLowerCase()));
    });
  }

  public async createOffer(payback: number, grossReturn: number, currency: string,
    fixedValue: number, offerTermsHash: string, assets: number[], success?: Function, error?: Function) {
      this.errorLogService.setParamValues([payback, grossReturn * 10000, currency, fixedValue * 100,
        this.web3Service.getInstance().utils.asciiToHex(offerTermsHash), assets]);
      const encoded = await this.getProtocolContract().methods
        .createOffer(
          payback,
          grossReturn * 10000,
          currency,
          this.web3Service.getInstance().utils.asciiToHex(offerTermsHash),
          assets)
        .send({ from: super.getWallet().address, value: 12345 });
        console.log(encoded);
    //  this.signAndSend(encoded, success, error);
  }

  public invest(assetAddress: string[], value: number, success?: Function, error?: Function) {
    const encoded = this.getProtocolContract().methods.invest(assetAddress).encodeABI();
    const ethusd = 340.0;
    let ethValue = value / ethusd;
    // Round to 18 decimals
    ethValue = Math.round(ethValue * Math.pow(10, 18)) / Math.pow(10, 18);
    return super.signAndSendTransaction(encoded, this.address, this.web3Service.getInstance().utils.toWei(ethValue), success, error);
  }
}
