import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';

import * as InvestmentAsset from '../../../../contracts/InvestmentAsset.json';
import { ProtocolAbstract } from './protocol.abstract';

@Injectable()
export class InvestmentAssetProtocolService extends ProtocolAbstract {

  protected abi = (InvestmentAsset as any).abi;

  public agreeInvestment(id: string, investor: string, agreementTermsHash: string, value: number, contractAddress: string, success?: Function, error?: Function) {
    this.errorLogService.setParamValues([id, investor,
      this.web3Service.getInstance().utils.asciiToHex(agreementTermsHash),
      this.web3Service.getInstance().utils.toWei(value)]);
    const encoded = super.getContract(contractAddress).methods.agreeInvestment(id, investor,
      this.web3Service.getInstance().utils.asciiToHex(agreementTermsHash),
      this.web3Service.getInstance().utils.toWei(value)).encodeABI();
    super.signAndSendTransaction(encoded, contractAddress, null, success, error);
  }

  public getContract(address) {
    const web3 = this.web3Service.getInstance();
    this.contract = new web3.eth.Contract(this.abi, address);
    return this.contract;
  }

  public getEvents(eventUuid, eventName, contractAddress, cb) {
    this.errorLogService.setParamValues([eventUuid, eventName, contractAddress, cb]);
    this.getContract(contractAddress).getPastEvents(eventName, {
      fromBlock: 0,
      toBlock: 'latest'
    }, (error, events) => {
      cb(error, events);
    });
  }

  public withdrawFunds(agreementTermsHash, contractAddress: string, success?: Function, error?: Function) {
    this.errorLogService.setParamValues([this.web3Service.getInstance().utils.asciiToHex(agreementTermsHash)]);
    const encoded = super.getContract(contractAddress).methods.withdrawFunds(
      this.web3Service.getInstance().utils.asciiToHex(agreementTermsHash)).encodeABI();
    super.signAndSendTransaction(encoded, contractAddress, null, success, error);
  }

  public refuseInvestment(contractAddress: string, success?: Function, error?: Function) {
    const encoded = super.getContract(contractAddress).methods.refuseInvestment().encodeABI();
    super.signAndSendTransaction(encoded, contractAddress, null, success, error);
  }

  public invest(contractAddress: string, value: number, agreementTermsHash: string, success?: Function, error?: Function) {
    this.errorLogService.setParamValues([this.web3Service.getInstance().utils.asciiToHex(agreementTermsHash)]);
    const encoded = this.getContract(contractAddress).methods
      .invest(this.web3Service.getInstance().utils.asciiToHex(agreementTermsHash))
      .encodeABI();
    const ethusd = 340.0;
    let ethValue = value / ethusd;
    // Round to 18 decimals
    ethValue = Math.round(ethValue * Math.pow(10, 18)) / Math.pow(10, 18);
    super.signAndSendTransaction(encoded, contractAddress, this.web3Service.getInstance().utils.toWei(ethValue), success, error);
  }

  public returnInvestment(contractAddress: string, value: number, success?: Function, error?: Function) {
    const encoded = this.getContract(contractAddress).methods.returnInvestment().encodeABI();
    const ethusd = 340.0;
    let ethValue = value / ethusd;
    // Round to 18 decimals
    ethValue = Math.round(ethValue * Math.pow(10, 18)) / Math.pow(10, 18);
    super.signAndSendTransaction(encoded, contractAddress, this.web3Service.getInstance().utils.toWei(ethValue), success, error);
  }

}
