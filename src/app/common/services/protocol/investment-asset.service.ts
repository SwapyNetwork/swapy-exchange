import { Injectable } from '@angular/core';

import { Web3Service } from '../web3.service';
import { WalletService } from '../wallet.service';

import { InvestmentAssetInterface as InvestmentAsset } from '../../../../../contracts/InvestmentAsset';
import { addresses } from '../../../../../contracts/address';
import { ProtocolAbstract } from './protocol.abstract';

@Injectable()
export class InvestmentAssetProtocolService extends ProtocolAbstract {

  protected abi = InvestmentAsset.abi;

  public agreeInvestment(id: string, investor: string, agreementTermsHash: string, value: number, contractAddress: string) {
    const encoded = super.getContract(contractAddress).methods.agreeInvestment(id, investor,
      this.web3Service.getInstance().utils.asciiToHex(agreementTermsHash),
      this.web3Service.getInstance().utils.toWei(value)).encodeABI();
    super.signAndSendTransaction(encoded, contractAddress);
  }

  public transferFunds(id: string, agreementTermsHash: string, contractAddress: string, value: number) {
    const encoded = super.getContract(contractAddress).methods.transferFunds(id,
      this.web3Service.getInstance().utils.asciiToHex(agreementTermsHash)).encodeABI();
    super.signAndSendTransaction(encoded, contractAddress, this.web3Service.getInstance().utils.toWei(value));
  }

}
